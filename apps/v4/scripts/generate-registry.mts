// 自动生成 registry-ui.ts 和 registry-blocks.ts，基础字段 name/type/files/dependencies/registryDependencies
import { promises as fs } from "fs"
import path from "path"

// 基于脚本真实路径推导 apps/v4 根目录，避免依赖执行时的 cwd
const SCRIPT_FILE = path.resolve(process.argv[1])
const SCRIPT_DIR = path.dirname(SCRIPT_FILE)
// 若脚本位于 .../apps/v4/scripts，则根目录为其上一级
const APP_ROOT =
  path.basename(SCRIPT_DIR) === "scripts"
    ? path.dirname(SCRIPT_DIR)
    : process.cwd()

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

// 规范化依赖：如果已经同时存在根包与其子路径（例如 @platejs/ai 与 @platejs/ai/react），只保留根包。
function normalizeDependencies(deps: string[]) {
  // 强收敛：无论是否引用子路径，一律折叠为根包：
  // @scope/name/anything -> @scope/name
  // package/sub/path -> package
  const roots = new Set<string>()
  deps.forEach((dep) => {
    if (!dep) return
    if (dep.startsWith("@")) {
      const parts = dep.split("/")
      // 至少 @scope/name
      if (parts.length >= 3) {
        roots.add(parts.slice(0, 2).join("/"))
      } else {
        roots.add(dep)
      }
    } else {
      // 普通包：取第一段
      const root = dep.split("/")[0]
      roots.add(root)
    }
  })
  return Array.from(roots).sort()
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
async function generateRegistry(
  dir: string,
  type: string,
  opts?: {
    uiNames?: Set<string>
  }
) {
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
    // 初步相对路径文件列表
    let relFilesRaw = graph.files
      .map((f) => {
        let rel = path.relative(REG_ROOT, f).replace(/\\/g, "/")
        if (!rel.startsWith("ui/") && !rel.startsWith("blocks/")) return null
        return rel
      })
      .filter(Boolean) as string[]
    // 去重
    relFilesRaw = Array.from(new Set(relFilesRaw))

    const uiNames = opts?.uiNames || new Set<string>()
    const needUiDeps: Set<string> = new Set()

    // 如果是 block：剔除已经在 UI registry 中注册过的 ui/<name>.tsx 文件
    if (type === "registry:block" && uiNames.size) {
      relFilesRaw = relFilesRaw.filter((rel) => {
        if (rel.startsWith("ui/")) {
          const base = rel
            .split("/")
            .pop()!
            .replace(/\.(tsx|ts)$/, "")
            .trim()
          if (uiNames.has(base)) {
            needUiDeps.add(base)
            return false // 不放入 files
          }
        }
        return true
      })
    }

    // 构建最终文件对象（blocks 细分子类型 + target 路径）
    const relFiles = relFilesRaw.map((rel) => {
      if (type !== "registry:block") {
        return { path: rel, type }
      }
      // rel 例: blocks/editor/components/editor/plugins/ai-kit.tsx
      // 规范：blocks/<blockName>/...
      const parts = rel.split("/")
      const blockName = ent.name
      const baseTarget = `components/${blockName}`
      // 去掉前两段 blocks/<blockName>
      let inner = parts.slice(2).join("/") // 可能为空或 index.tsx / xxx.tsx
      let fileType = "registry:block"
      const ext = inner.split(".").pop() || ""
      const baseFile = inner.split("/").pop() || ""
      const firstSeg = inner.split("/")[0] || ""
      // 分类规则
      const innerSegments = parts.slice(2)
      const isRootIndex =
        innerSegments.length === 0 ||
        (innerSegments.length === 1 &&
          (baseFile === "index.ts" || baseFile === "index.tsx"))

      if (isRootIndex) {
        fileType = "registry:block"
      } else if (firstSeg === "components" || inner.startsWith("components/")) {
        fileType = "registry:component"
      } else if (
        firstSeg === "hooks" ||
        inner.includes("/hooks/") ||
        /-hook\.(t|j)sx?$/.test(baseFile)
      ) {
        fileType = "registry:hook"
      } else if (
        baseFile === "lib.ts" ||
        baseFile === "lib.tsx" ||
        inner.includes("/lib/") ||
        firstSeg === "lib"
      ) {
        fileType = "registry:lib"
      } else if (baseFile === "page.tsx" || baseFile === "page.ts") {
        fileType = "registry:page"
      } else if (!/(t|j)sx?$/.test(ext)) {
        fileType = "registry:file"
      } else {
        fileType = "registry:block"
      }
      // 生成 target：
      // 入口 index.* -> components/<blockName>
      // 其它文件 -> components/<blockName>/<remaining path>
      let target: string
      if (isRootIndex) {
        target = baseTarget
      } else {
        target = `${baseTarget}/${inner}`.replace(/\\/g, "/")
      }
      return { path: rel, type: fileType, target }
    })
    // 现有 registryDeps 加上需要的 UI 依赖
    needUiDeps.forEach((u) => registryDeps.push(u))

    // 去重并过滤：如果某名字已经在本条目的 files 中（作为内部文件存在），则不要再放进 registryDependencies
    const internalFileBaseNames = new Set(
      relFiles.map((f) =>
        f.path
          .split("/")
          .pop()!
          .replace(/\.(tsx|ts)$/, "")
      )
    )
    const finalRegistryDeps = Array.from(
      new Set(registryDeps.filter((n) => !internalFileBaseNames.has(n)))
    ).sort()

    items.push({
      name: ent.name,
      type,
      files: relFiles,
      dependencies: graph.dependencies.length
        ? normalizeDependencies(graph.dependencies)
        : undefined,
      registryDependencies: finalRegistryDeps.length
        ? finalRegistryDeps
        : undefined,
    })
  }
  // 按名称排序，确保输出稳定
  return items.sort((a: any, b: any) => a.name.localeCompare(b.name))
}

async function main() {
  const uiItems = await generateRegistry(uiDir, "registry:ui")
  // 收集 ui 组件名称，用于在生成 blocks 时过滤已注册 UI 文件并放入 registryDependencies
  const uiNames = new Set(uiItems.map((i: any) => i.name))
  const blocksItems = await generateRegistry(blocksDir, "registry:block", {
    uiNames,
  })

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
