// 自动生成 registry-ui.ts 和 registry-blocks.ts，基础字段 name/type/files/dependencies/registryDependencies

import { promises as fs } from "fs"
import path from "path"

// 直接使用 Node.js 默认的 __dirname
// __dirname 由 Node.js 提供，无需自定义

const CWD = process.cwd()
const APP_ROOT = CWD // 脚本在 apps/v4 下执行
const REG_ROOT = path.join(APP_ROOT, "registry/new-york-v4")
const uiDir = path.join(REG_ROOT, "ui")
const blocksDir = path.join(REG_ROOT, "blocks")
const OUTPUT_DIR = path.join(APP_ROOT, "registry")
const outputUi = path.join(OUTPUT_DIR, "registry-ui.ts")
const outputBlocks = path.join(OUTPUT_DIR, "registry-blocks.ts")

// 解析 import 语句，提取依赖包和本地文件
function parseImports(code: string) {
  const regex = /import\s+[^'";]+from\s+['"]([^'"]+)['"]/g
  const deps: string[] = []
  const locals: string[] = []
  let match
  while ((match = regex.exec(code))) {
    const pkg = match[1]
    if (
      !pkg.startsWith("./") &&
      !pkg.startsWith("../") &&
      !pkg.startsWith("@/registry/new-york-v4/ui") &&
      !pkg.startsWith("@/registry/new-york-v4/blocks") &&
      !pkg.startsWith("@/")
    ) {
      deps.push(pkg)
    } else {
      locals.push(pkg)
    }
  }
  return {
    dependencies: Array.from(new Set(deps)),
    localImports: Array.from(new Set(locals)),
  }
}

async function fileExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

// 解析本地 import 为绝对文件路径（支持 ./ ../ @/ 和 @/registry/new-york-v4/*），并解析到具体 .ts/.tsx 或目录下 index.*
async function resolveImportToFile(specifier: string, fromFile: string) {
  let candidate: string | null = null
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    candidate = path.resolve(path.dirname(fromFile), specifier)
  } else if (specifier.startsWith("@/registry/new-york-v4/")) {
    candidate = path.join(APP_ROOT, specifier.replace(/^@\//, ""))
  } else if (specifier.startsWith("@/")) {
    candidate = path.join(APP_ROOT, specifier.slice(2))
  } else if (path.isAbsolute(specifier)) {
    candidate = specifier
  } else {
    return null
  }

  // 若已带扩展名
  if (candidate && (candidate.endsWith(".ts") || candidate.endsWith(".tsx"))) {
    if (await fileExists(candidate)) return candidate
    return null
  }

  // 尝试作为文件
  if (await fileExists(candidate + ".tsx")) return candidate + ".tsx"
  if (await fileExists(candidate + ".ts")) return candidate + ".ts"

  // 尝试作为目录 index
  try {
    const stat = await fs.stat(candidate)
    if (stat.isDirectory()) {
      const idxTsx = path.join(candidate, "index.tsx")
      const idxTs = path.join(candidate, "index.ts")
      if (await fileExists(idxTsx)) return idxTsx
      if (await fileExists(idxTs)) return idxTs
    }
  } catch {}
  return null
}

type DepGraph = {
  files: string[]
  dependencies: string[]
  registryDependencies: string[]
}

// 递归收集：本地 ts/tsx 文件（包括未注册的）、聚合外部依赖和 registry 依赖
async function collectDependencyGraph(entryAbsFile: string): Promise<DepGraph> {
  const visited = new Set<string>()
  const queue: string[] = []
  const allFiles: Set<string> = new Set()
  const allDeps: Set<string> = new Set()
  const allRegDeps: Set<string> = new Set()

  queue.push(entryAbsFile)
  while (queue.length) {
    const curr = queue.shift()!
    if (visited.has(curr)) continue
    visited.add(curr)
    allFiles.add(curr)

    let code = ""
    try {
      code = await fs.readFile(curr, "utf8")
    } catch {}

    const { dependencies, localImports } = parseImports(code)
    // 外部依赖
    for (const d of dependencies) allDeps.add(d)

    // registry 依赖（基于路径分析，允许省略扩展名）
    for (const imp of [...localImports, ...dependencies]) {
      const m = imp.match(
        /^@\/registry\/new-york-v4\/(ui|blocks)\/(.+?)(?:\.tsx?)?$/
      )
      if (m) {
        const base = m[2].split("/").pop() || m[2]
        allRegDeps.add(base)
      }
    }

    // 继续遍历本地依赖
    for (const imp of localImports) {
      const resolved = await resolveImportToFile(imp, curr)
      if (resolved) {
        if (!visited.has(resolved)) queue.push(resolved)
      }
    }
  }

  return {
    files: Array.from(allFiles),
    dependencies: Array.from(allDeps),
    registryDependencies: Array.from(allRegDeps),
  }
}

// 解析 registry 组件依赖
function parseRegistryDeps(code: string) {
  // 允许省略扩展名，捕获最后一个文件名作为依赖项名
  const regDepRegex =
    /import\s+[^'";]+from\s+['"]@\/registry\/new-york-v4\/(ui|blocks)\/(.+?)['"]/g
  const registryDeps: string[] = []
  let regMatch
  while ((regMatch = regDepRegex.exec(code))) {
    const spec = regMatch[2]
    const base = spec.replace(/\\/g, "/").split("/").pop() || spec
    // 去掉可能的扩展名 .ts / .tsx
    const cleaned = base.replace(/\.(?:ts|tsx)$/i, "")
    registryDeps.push(cleaned)
  }
  return Array.from(new Set(registryDeps))
}

// 生成 registry item
async function generateRegistry(dir: string, type: string) {
  // 同时支持：
  // 1) 顶层 .ts/.tsx 文件
  // 2) 含有 index.ts 或 index.tsx 的子目录作为入口
  const dirents = (await fs.readdir(dir, {
    withFileTypes: true,
  } as any)) as any[]
  const entries: { name: string; entry: string }[] = []
  for (const d of dirents) {
    if (d.isFile()) {
      const name = d.name as string
      if (!name.endsWith(".tsx") && !name.endsWith(".ts")) continue
      entries.push({
        name: name.replace(/\.(tsx|ts)$/, ""),
        entry: path.join(dir, name),
      })
    } else if (d.isDirectory()) {
      const idxTsx = path.join(dir, d.name, "index.tsx")
      const idxTs = path.join(dir, d.name, "index.ts")
      if (await fileExists(idxTsx))
        entries.push({ name: d.name, entry: idxTsx })
      else if (await fileExists(idxTs))
        entries.push({ name: d.name, entry: idxTs })
    }
  }

  const items = []
  for (const ent of entries) {
    const filePath = ent.entry
    const code = await fs.readFile(filePath, "utf8")
    // 聚合收集：本地文件、外部依赖、registry 依赖
    const graph = await collectDependencyGraph(filePath)
    // 额外：入口文件直连 registry 依赖（防守性）
    const registryDepsFromEntry = parseRegistryDeps(code)
    const registryDeps = Array.from(
      new Set([...graph.registryDependencies, ...registryDepsFromEntry])
    )
    // 转为相对 registry 路径（与 build-registry.mts 保持一致）
    const relFiles = graph.files
      .map((f) => {
        let rel = path.relative(REG_ROOT, f).replace(/\\/g, "/")
        // shadcn 规范要求路径必须以 ui/ 或 blocks/ 开头
        if (!rel.startsWith("ui/") && !rel.startsWith("blocks/")) return null
        return {
          path: rel,
          type,
        }
      })
      .filter(Boolean)
    items.push({
      name: ent.name,
      type,
      files: relFiles,
      dependencies: graph.dependencies.length
        ? [...graph.dependencies].sort()
        : undefined,
      registryDependencies: registryDeps.length
        ? [...registryDeps].sort()
        : undefined,
    })
  }
  // 按名称排序，确保输出稳定
  return items.sort((a: any, b: any) => a.name.localeCompare(b.name))
}

async function main() {
  const uiItems = await generateRegistry(uiDir, "registry:ui")
  const blocksItems = await generateRegistry(blocksDir, "registry:block")

  // 写入 registry-ui.ts

  const uiContent = `import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = ${JSON.stringify(uiItems, null, 2)}
`
  await fs.writeFile(outputUi, uiContent, "utf8")

  // 写入 registry-blocks.ts
  const blocksContent = `import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = ${JSON.stringify(blocksItems, null, 2)}
`
  await fs.writeFile(outputBlocks, blocksContent, "utf8")

  console.log("✅ registry-ui.ts 和 registry-blocks.ts 已生成")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
