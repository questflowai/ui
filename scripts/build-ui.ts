import fs from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

import { ui } from "../apps/v4/registry/registry-ui.js"
import { createCdnClient } from "./cdn.js"

const PUBLIC_DIR = path.join(process.cwd(), "build")

// workspace UI source roots
const UI_PKG_ROOT = path.join(process.cwd(), "apps", "v4")
const UI_SRC_DIR = path.join(UI_PKG_ROOT, "registry", "new-york-v4")
const UI_COMPONENTS_DIR = path.join(UI_SRC_DIR, "ui")
const UI_HOOKS_DIR = path.join(UI_SRC_DIR, "hooks")
const UI_BLOCKS_DIR = path.join(UI_SRC_DIR, "blocks")
const UI_LIB_DIR = path.join(UI_PKG_ROOT, "lib")

interface ComponentDependency {
  name: string
  version: string
  url: string
}

interface ComponentManifest {
  name: string
  files: string[]
  dependencies: ComponentDependency[]
  internalDependencies: string[]
}

interface BuildManifest {
  version: string
  timestamp: string
  components: ComponentManifest[]
  importMap: Record<string, string>
  cssPath?: string
  cdnBaseUrl?: string
}

// Get version from www package.json (as requested)
async function getVersionFromWww(): Promise<string> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "apps", "v4", "package.json"),
        "utf-8"
      )
    )
    return pkg.version || "0.0.1"
  } catch {
    return "0.0.1"
  }
}

// Get dependency versions from www package.json
async function getDependencyVersions(): Promise<Record<string, string>> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "apps", "v4", "package.json"),
        "utf-8"
      )
    )
    return { ...pkg.dependencies, ...pkg.devDependencies }
  } catch {
    return {}
  }
}

// Extract dependencies from registry-ui.ts
function extractRegistryDependencies(): Map<string, Set<string>> {
  const componentDeps = new Map<string, Set<string>>()

  for (const component of ui) {
    const deps = new Set<string>()
    if (component.dependencies) {
      for (const dep of component.dependencies) {
        // Filter out react core dependencies as they're handled separately
        if (dep !== "react" && dep !== "react-dom") {
          deps.add(dep)
        }
      }
    }
    componentDeps.set(component.name, deps)
  }

  return componentDeps
}

// Analyze common dependencies across components
function analyzeCommonDependencies(componentDeps: Map<string, Set<string>>): {
  common: Set<string>
  usage: Map<string, number>
} {
  const usage = new Map<string, number>()
  const allDeps = new Set<string>()

  // Count usage of each dependency
  Array.from(componentDeps.values()).forEach((deps) => {
    Array.from(deps).forEach((dep) => {
      allDeps.add(dep)
      usage.set(dep, (usage.get(dep) || 0) + 1)
    })
  })

  // Consider dependencies used by 3+ components as common
  const common = new Set<string>()
  const totalComponents = componentDeps.size
  Array.from(usage.entries()).forEach(([dep, count]) => {
    if (count >= Math.min(3, Math.ceil(totalComponents * 0.3))) {
      common.add(dep)
    }
  })

  return { common, usage }
}

// Add all dependencies to import map with version and prefix mapping
function applyAllDepsToImportMap(
  importMap: Record<string, string>,
  allDeps: Set<string>,
  versions: Record<string, string>
) {
  const sanitize = (v: string) => {
    const s = String(v).trim()
    if (!s) return ""
    if (s.startsWith("workspace:")) return ""
    return s.replace(/^[\^~]/, "")
  }

  for (const base of Array.from(allDeps)) {
    const raw = versions?.[base]
    const ver = raw ? sanitize(raw) : ""
    if (!ver) continue // require a concrete version to avoid ranges/redirects

    const externalQuery = encodeURIComponent(
      "react,react-dom,react/jsx-runtime"
    )

    importMap[base] = `https://esm.sh/${base}@${ver}?external=${externalQuery}`
    const pref = `${base}/`
    importMap[pref] = `https://esm.sh/${base}@${ver}/?external=${externalQuery}`
  }
}

// Generate importmap with component mappings
async function generateImportMap(
  uiVersion: string,
  publicPrefix: string,
  componentDeps: Map<string, Set<string>>,
  versions: Record<string, string>,
  cdnBaseUrl?: string,
  cssPublicPath?: string
): Promise<Record<string, string>> {
  const importMap: Record<string, string> = {}

  // Add React core dependencies
  // const reactVersion = versions.react || "18.2.0"
  // const reactDomVersion = versions["react-dom"] || "18.2.0"

  // importMap["react"] = `https://esm.sh/react@${reactVersion}`
  // importMap["react-dom"] = `https://esm.sh/react-dom@${reactDomVersion}`
  // importMap[
  //   "react/jsx-runtime"
  // ] = `https://esm.sh/react@${reactVersion}/jsx-runtime`

  // Get all dependencies (both common and rare) to ensure complete coverage
  const { common, usage } = analyzeCommonDependencies(componentDeps)

  // Collect ALL dependencies from both registry and static analysis
  const registryDeps = extractRegistryDependencies()
  const staticDeps = await scanUiThirdPartyDeps()

  // Combine all dependencies to ensure nothing is missed
  const allDeps = new Set(Array.from(staticDeps))
  Array.from(registryDeps.values()).forEach((deps) => {
    Array.from(deps).forEach((dep) => {
      allDeps.add(dep)
    })
  })

  // Add ALL dependencies to importmap (not just common ones)
  applyAllDepsToImportMap(importMap, allDeps, versions)

  // Add path prefix mappings for components (much more efficient)
  const baseUrl = cdnBaseUrl || ""

  // Map component directories to their CDN paths (keep for backward compatibility)
  importMap["@/components/ui/"] = `${baseUrl}${publicPrefix}ui/`
  importMap["@/components/blocks/"] = `${baseUrl}${publicPrefix}blocks/`
  importMap["@/components/hooks/"] = `${baseUrl}${publicPrefix}hooks/`
  importMap["@/components/lib/"] = `${baseUrl}${publicPrefix}lib/`

  // Add specific file mappings with .js extensions for CDN compatibility
  const uiSpecs = await collectUiSourceSpecifiers()
  for (const spec of uiSpecs) {
    // Map each specific file to its .js version on CDN
    importMap[`@/components/${spec}`] = `${baseUrl}${publicPrefix}${spec}.js`
  }

  // Add CSS mapping if available
  if (cssPublicPath) {
    importMap["ui:css"] = `${baseUrl}${cssPublicPath}`
  }

  return importMap
}

// Generate build manifest
async function generateBuildManifest(
  uiVersion: string,
  componentDeps: Map<string, Set<string>>,
  versions: Record<string, string>,
  importMap: Record<string, string>,
  cdnBaseUrl?: string
): Promise<BuildManifest> {
  const components: ComponentManifest[] = []

  Array.from(componentDeps.entries()).forEach(([componentName, deps]) => {
    const componentInfo = ui.find((c: any) => c.name === componentName)
    if (!componentInfo) return

    const dependencies: ComponentDependency[] = []
    Array.from(deps).forEach((dep) => {
      const version = versions[dep]
      if (version) {
        dependencies.push({
          name: dep,
          version: version.replace(/^[\^~]/, ""),
          url:
            importMap[dep] ||
            `https://esm.sh/${dep}@${version.replace(/^[\^~]/, "")}`,
        })
      }
    })

    // Find internal dependencies (other components this component depends on)
    const internalDependencies: string[] = []
    const componentFiles = componentInfo.files || []

    // This is a simplified approach - in a real scenario, you'd parse the component files
    // to find actual internal dependencies
    for (const file of componentFiles) {
      if (file.path !== `ui/${componentName}.tsx`) {
        const depName = path.basename(file.path, ".tsx")
        if (depName !== componentName) {
          internalDependencies.push(depName)
        }
      }
    }

    components.push({
      name: componentName,
      files: componentFiles.map((f: any) => f.path),
      dependencies,
      internalDependencies,
    })
  })

  return {
    version: uiVersion,
    timestamp: new Date().toISOString(),
    components,
    importMap,
    cdnBaseUrl,
  }
}

// Build-ui.ts no longer handles CDN upload - that's now handled by release.ts

async function pathExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
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
 * Compile CSS using PostCSS and Tailwind CSS
 * Generates a complete CSS bundle with all necessary styles
 */
async function compileCss(
  uiVersion: string,
  outDir: string,
  publicPrefix: string
): Promise<string | undefined> {
  try {
    console.log("Compiling CSS...")

    // Create styles directory
    const stylesDir = path.join(outDir, "styles")
    await fs.mkdir(stylesDir, { recursive: true })

    // Read the main CSS file
    const mainCssPath = path.join(UI_PKG_ROOT, "styles", "globals.css")
    const cssContent = await fs.readFile(mainCssPath, "utf-8")

    // For Tailwind CSS v4, we need to use the existing postcss config
    // Read the postcss config from the v4 app
    const postcssConfigPath = path.join(UI_PKG_ROOT, "postcss.config.mjs")
    let postcssConfig

    try {
      // Import the postcss config dynamically
      const configModule = await import(postcssConfigPath)
      postcssConfig = configModule.default || configModule
    } catch (error) {
      console.log("Using fallback PostCSS config")
      // Fallback config for Tailwind CSS v4
      postcssConfig = {
        plugins: {
          "@tailwindcss/postcss": {},
          autoprefixer: {},
        },
      }
    }

    // Create PostCSS processor with the config
    const plugins = []

    // Add Tailwind CSS plugin
    if (postcssConfig.plugins["@tailwindcss/postcss"]) {
      try {
        const tailwindPostcss = await import("@tailwindcss/postcss")
        plugins.push(tailwindPostcss.default())
      } catch (error) {
        console.log("@tailwindcss/postcss not found, using regular tailwindcss")
        plugins.push(tailwindcss())
      }
    } else {
      // Fallback to regular tailwindcss
      plugins.push(tailwindcss())
    }

    // Add autoprefixer
    plugins.push(autoprefixer())

    // Process CSS with PostCSS
    const result = await postcss(plugins).process(cssContent, {
      from: mainCssPath,
      to: undefined,
    })

    // Write the compiled CSS
    const outputCssPath = path.join(stylesDir, "globals.css")
    await fs.writeFile(outputCssPath, result.css)

    const cssPublicPath = `${publicPrefix}styles/globals.css`
    console.log(`CSS compiled successfully: ${outputCssPath}`)
    console.log(`CSS public path: ${cssPublicPath}`)

    return cssPublicPath
  } catch (error) {
    console.error("CSS compilation failed:", error)
    return undefined
  }
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
  const uiVersion = await getVersionFromWww()
  const outDir = path.join(process.cwd(), "build", uiVersion)
  const publicPrefix = `/mc/${uiVersion}/`

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

    // Get dependencies from registry and static analysis
    const registryDeps = extractRegistryDependencies()
    const staticDeps = await scanUiThirdPartyDeps()

    // Combine both sources of dependency information
    const allExtraPkgs = new Set(Array.from(staticDeps))
    Array.from(registryDeps.values()).forEach((deps) => {
      Array.from(deps).forEach((dep) => {
        allExtraPkgs.add(dep)
      })
    })

    const dynamicExternal: string[] = []
    Array.from(allExtraPkgs).forEach((pkg) => {
      dynamicExternal.push(pkg, `${pkg}/*`)
    })

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
    console.log("Starting UI build process...")

    // Build the UI components
    const result = await ensureUiBrowserEsmTree()
    console.log(`UI build successful! Version: ${result.uiVersion}`)

    // Compile CSS
    const cssPublicPath = await compileCss(
      result.uiVersion,
      result.outDir,
      result.publicPrefix
    )

    // Get dependency information
    const versions = await getDependencyVersions()
    const componentDeps = extractRegistryDependencies()

    // Get CDN client and base URL
    const cdnClient = createCdnClient()
    const cdnBaseUrl = cdnClient?.publicUrl("") || undefined

    // Generate importmap
    const importMap = await generateImportMap(
      result.uiVersion,
      result.publicPrefix,
      componentDeps,
      versions,
      cdnBaseUrl,
      cssPublicPath
    )

    // Generate build manifest with CSS path
    const manifest = await generateBuildManifest(
      result.uiVersion,
      componentDeps,
      versions,
      importMap,
      cdnBaseUrl
    )

    // Add CSS path to manifest
    if (cssPublicPath) {
      manifest.cssPath = cssPublicPath
    }

    // Write importmap to file
    const importMapPath = path.join(result.outDir, `importmap.json`)
    await fs.writeFile(
      importMapPath,
      JSON.stringify({ imports: importMap }, null, 2)
    )
    console.log(`Generated importmap: ${importMapPath}`)

    // Write manifest to file
    const manifestPath = path.join(result.outDir, `manifest.json`)
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
    console.log(`Generated manifest: ${manifestPath}`)

    // Summary
    console.log("\n=== Build Summary ===")
    console.log(`Version: ${result.uiVersion}`)
    console.log(`Output directory: ${result.outDir}`)
    console.log(`Components built: ${result.builtJs.length}`)
    console.log(`CSS compiled: ${cssPublicPath ? "✓" : "✗"}`)
    console.log(
      `Common dependencies: ${
        Array.from(analyzeCommonDependencies(componentDeps).common).length
      }`
    )
    console.log(`Total registry components: ${componentDeps.size}`)

    console.log("\n=== Usage Example ===")
    console.log("Add this to your HTML:")
    if (cssPublicPath) {
      console.log(`<link rel="stylesheet" href="${cssPublicPath}">`)
    }
    console.log(
      `<script type="importmap" src="${result.publicPrefix}importmap.json"></script>`
    )
    console.log('<script type="module">')
    console.log('  import { Button } from "components/ui/button"')
    console.log('  import { Calendar } from "components/blocks/calendar-01"')
    console.log('  import { useMobile } from "components/hooks/use-mobile"')
    console.log('  import { cn } from "components/lib/utils"')
    console.log("  // Use your components...")
    console.log("</script>")
  } catch (error) {
    console.error("UI build failed:", error)
    process.exit(1)
  }
}

main()
