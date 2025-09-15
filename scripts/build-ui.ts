import fs from "node:fs/promises"
import path from "node:path"

const PUBLIC_DIR = path.join(process.cwd(), "build")
const MANIFESTS_DIR = path.join(PUBLIC_DIR, "manifests")

const BUILD_UI_DIR = path.join(
  process.cwd(),
  "build",
  "apps",
  "v4",
  "registry",
  "new-york-v4"
)

// workspace UI source roots
const UI_PKG_ROOT = path.join(process.cwd(), "apps", "v4")
const UI_SRC_DIR = path.join(UI_PKG_ROOT, "registry", "new-york-v4")
const UI_COMPONENTS_DIR = path.join(UI_SRC_DIR, "ui")
const UI_HOOKS_DIR = path.join(UI_SRC_DIR, "hooks")
const UI_BLOCKS_DIR = path.join(UI_SRC_DIR, "blocks")
const UI_LIB_DIR = path.join(UI_PKG_ROOT, "lib")

async function pathExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

// Minimal UI pack version from workspace (fallback 0.0.0)
async function getUiVersion(): Promise<string> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(path.join(UI_PKG_ROOT, "package.json"), "utf-8")
    )
    return pkg.version || "0.0.0"
  } catch {
    return "0.0.0"
  }
}

async function listFilesRecursive(
  dir: string,
  exts: string[]
): Promise<string[]> {
  const out: string[] = []
  async function walk(d: string) {
    let entries: Array<{ name: string; isDir: boolean }> = []
    try {
      const names = (await (fs as any).readdir(d, {
        withFileTypes: true,
      })) as any[]
      entries = names.map((de: any) => ({
        name: String(de?.name ?? de),
        isDir: typeof de?.isDirectory === "function" ? de.isDirectory() : false,
      }))
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(d, e.name)
      if (e.isDir) {
        await walk(full)
      } else {
        const ext = path.extname(e.name).toLowerCase()
        if (exts.includes(ext)) out.push(full)
      }
    }
  }
  await walk(dir)
  return out
}

// Return base package of a specifier (e.g. "@scope/name/x" -> "@scope/name", "date-fns/format" -> "date-fns")
function getPackageBase(spec: string): string | null {
  if (!spec || spec.startsWith(".") || spec.startsWith("/")) return null
  if (spec.startsWith("@workspace/ui") || spec.startsWith("ui")) return null

  // Special-cased jsx-runtime is handled separately
  if (spec === "react/jsx-runtime") return "react"

  if (spec.startsWith("@")) {
    const parts = spec.split("/")
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`
    return null
  }
  const first = spec.split("/")[0]
  return first || null
}

// Scan UI sources and collect third-party base packages used
async function scanUiThirdPartyDeps(): Promise<Set<string>> {
  const files: string[] = []
  if (await pathExists(UI_COMPONENTS_DIR)) {
    files.push(
      ...(await listFilesRecursive(UI_COMPONENTS_DIR, [".ts", ".tsx"]))
    )
  }
  if (await pathExists(UI_BLOCKS_DIR)) {
    files.push(...(await listFilesRecursive(UI_BLOCKS_DIR, [".ts", ".tsx"])))
  }
  if (await pathExists(UI_HOOKS_DIR)) {
    files.push(...(await listFilesRecursive(UI_HOOKS_DIR, [".ts", ".tsx"])))
  }
  if (await pathExists(UI_LIB_DIR)) {
    files.push(...(await listFilesRecursive(UI_LIB_DIR, [".ts", ".tsx"])))
  }

  const importRe = /import\s+[^'"]*?from\s*["']([^"']+)["']/g
  const exportRe = /export\s+[^'"]*?from\s*["']([^"']+)["']/g
  const dynRe = /import\s*\(\s*["']([^"']+)["']\s*\)/g

  const bases = new Set<string>()
  for (const f of files) {
    let src = ""
    try {
      src = await fs.readFile(f, "utf-8")
    } catch {
      continue
    }
    for (const re of [importRe, exportRe, dynRe]) {
      re.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(src))) {
        const spec = m[1]
        const base = getPackageBase(spec)
        if (base && base !== "react" && base !== "react-dom") {
          bases.add(base)
        }
      }
    }
  }
  // Always consider react-dom/jsx-runtime external (baseline already covers)
  return bases
}

// Collect UI subpath specifiers (without extension) for components/lib/hooks
async function collectUiSourceSpecifiers(): Promise<string[]> {
  const toNoExt = (abs: string, base: string) =>
    path
      .relative(base, abs)
      .replace(/\.(tsx|ts)$/, "")
      .split(path.sep)
      .join("/")

  const out: string[] = []
  if (await pathExists(UI_COMPONENTS_DIR)) {
    out.push(
      ...(await listFilesRecursive(UI_COMPONENTS_DIR, [".ts", ".tsx"])).map(
        (abs) => toNoExt(abs, UI_SRC_DIR)
      )
    )
  }
  if (await pathExists(UI_BLOCKS_DIR)) {
    out.push(
      ...(await listFilesRecursive(UI_BLOCKS_DIR, [".ts", ".tsx"])).map((abs) =>
        toNoExt(abs, UI_SRC_DIR)
      )
    )
  }
  if (await pathExists(UI_HOOKS_DIR)) {
    out.push(
      ...(await listFilesRecursive(UI_HOOKS_DIR, [".ts", ".tsx"])).map((abs) =>
        toNoExt(abs, UI_SRC_DIR)
      )
    )
  }
  if (await pathExists(UI_LIB_DIR)) {
    out.push(
      ...(await listFilesRecursive(UI_LIB_DIR, [".ts", ".tsx"])).map((abs) =>
        toNoExt(abs, UI_PKG_ROOT)
      )
    )
  }
  return Array.from(new Set(out))
}

/**
 * Build UI browser ESM tree (components/*.tsx, lib/*.ts) and compile Tailwind CSS to a single globals.css.
 * Returns local public paths prefix and css path to be used in importmap.
 */
async function ensureUiBrowserEsmTree(): Promise<{
  uiVersion: string
  outDir: string
  publicPrefix: string
  cssPublicPath?: string
  builtJs: string[]
}> {
  const uiVersion = await getUiVersion()
  const outDir = path.join(BUILD_UI_DIR, uiVersion)
  const publicPrefix = `/ui/${uiVersion}/`

  // Ensure output dir exists
  await fs.mkdir(outDir, { recursive: true })

  // Collect source files
  const components = (await pathExists(UI_COMPONENTS_DIR))
    ? await listFilesRecursive(UI_COMPONENTS_DIR, [".tsx", ".ts"])
    : []
  const hookFiles = (await pathExists(UI_HOOKS_DIR))
    ? await listFilesRecursive(UI_HOOKS_DIR, [".ts", ".tsx"])
    : []
  const blocksFiles = (await pathExists(UI_BLOCKS_DIR))
    ? await listFilesRecursive(UI_BLOCKS_DIR, [".ts", ".tsx"])
    : []
  const libFiles = (await pathExists(UI_LIB_DIR))
    ? await listFilesRecursive(UI_LIB_DIR, [".ts", ".tsx"])
    : []

  const allFiles = [...components, ...blocksFiles, ...hookFiles, ...libFiles]
  const entryPoints = allFiles.reduce((acc, abs) => {
    const isLib = abs.startsWith(UI_LIB_DIR)
    const rel = path
      .relative(isLib ? UI_PKG_ROOT : UI_SRC_DIR, abs)
      .replace(/\.(tsx|ts)$/, "")
    acc[rel] = abs
    return acc
  }, {} as Record<string, string>)

  // Build each component and lib file as a separate entry point
  if (allFiles.length > 0) {
    const baseExternal = ["react", "react-dom", "react/jsx-runtime"]

    // Auto-detect third-party deps used by UI and externalize them (base + subpath)
    const extraPkgs = await scanUiThirdPartyDeps()
    const dynamicExternal: string[] = []
    for (const pkg of Array.from(extraPkgs)) {
      dynamicExternal.push(pkg, `${pkg}/*`)
    }

    // Externalize all intra-UI imports so each component is a standalone file
    const uiSpecs = await collectUiSourceSpecifiers()
    const uiExternal = uiSpecs.map((s) => `@/components/${s}`).flat()

    const { build } = await import("esbuild")
    await build({
      entryPoints,
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      write: true,
      sourcemap: false,
      outdir: outDir,
      external: [...baseExternal, ...dynamicExternal, ...uiExternal],
      plugins: [
        {
          name: "rewrite-paths",
          setup(build) {
            build.onResolve(
              { filter: /^@\/registry\/new-york-v4\// },
              (args) => {
                const newPath = args.path.replace(
                  "@/registry/new-york-v4/",
                  "@/components/"
                )
                return { path: newPath, external: true }
              }
            )
            build.onResolve({ filter: /^@\/lib\// }, (args) => {
              const newPath = args.path.replace("@/lib/", "@/components/lib/")
              return { path: newPath, external: true }
            })
          },
        },
        {
          name: "react-import-fix",
          setup(build) {
            build.onLoad({ filter: /packages\/ui\/.*\.tsx$/ }, async (args) => {
              let contents = await fs.readFile(args.path, "utf8")
              contents = contents.replace(
                'import * as React from "react"',
                'import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"'
              )
              contents = contents.replace(
                /React\.(useState|useEffect|useCallback|useMemo|useRef)/g,
                "$1"
              )
              return { contents, loader: "tsx" }
            })
          },
        },
      ],
    })
  }

  const builtJs = Object.keys(entryPoints).map((name) => `${name}.js`)

  return { uiVersion, outDir, publicPrefix, builtJs }
}

async function main() {
  try {
    const result = await ensureUiBrowserEsmTree()
    console.log("UI build successful!")
    console.log(`Version: ${result.uiVersion}`)
    console.log(`Output directory: ${result.outDir}`)
    console.log("Built files:", result.builtJs)
  } catch (error) {
    console.error("UI build failed:", error)
    process.exit(1)
  }
}

main()
