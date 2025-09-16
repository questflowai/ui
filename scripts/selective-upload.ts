import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { createCdnClient } from "./cdn"

// Load environment variables from .env file
async function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env")
    const envContent = await fs.readFile(envPath, "utf-8")

    for (const line of envContent.split("\n")) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=")
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    }
  } catch (error) {
    // .env file doesn't exist or can't be read, that's okay
  }
}

interface UploadOptions {
  cssOnly?: boolean
  uiOnly?: boolean
  blocksOnly?: boolean
  chartsOnly?: boolean
  hooksOnly?: boolean
  libOnly?: boolean
  examplesOnly?: boolean
  components?: string[]
  blocks?: string[]
  charts?: string[]
  hooks?: string[]
  exclude?: string[]
  preset?: string
  dryRun?: boolean
}

interface UploadPreset {
  name: string
  description: string
  categories: string[]
  components?: string[]
  exclude?: string[]
}

const PRESETS: UploadPreset[] = [
  {
    name: "essential-ui",
    description: "Essential UI components for basic applications",
    categories: ["ui", "lib"],
    components: ["button", "card", "input", "label", "select", "textarea", "checkbox", "radio-group"],
  },
  {
    name: "dashboard-components",
    description: "Components needed for dashboard applications",
    categories: ["ui", "blocks", "charts", "hooks", "lib"],
    components: ["button", "card", "table", "badge", "avatar", "dropdown-menu"],
    exclude: ["calendar-*", "login-*"],
  },
  {
    name: "css-only",
    description: "Upload only CSS files",
    categories: ["css"],
  },
  {
    name: "charts-complete",
    description: "All chart components and dependencies",
    categories: ["charts", "ui", "hooks", "lib"],
    components: ["card", "button"],
  },
]

const UI_PKG_ROOT = path.join(process.cwd(), "apps", "v4")
const UI_SRC_DIR = path.join(UI_PKG_ROOT, "registry", "new-york-v4")

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

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".js":
    case ".mjs":
    case ".cjs":
      return "application/javascript; charset=utf-8"
    case ".css":
      return "text/css; charset=utf-8"
    case ".html":
    case ".htm":
      return "text/html; charset=utf-8"
    case ".json":
    case ".map":
      return "application/json; charset=utf-8"
    case ".txt":
      return "text/plain; charset=utf-8"
    case ".svg":
      return "image/svg+xml"
    default:
      return "application/octet-stream"
  }
}

async function listFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files: string[] = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await listFiles(fullPath)))
      } else if (entry.isFile()) {
        files.push(fullPath)
      }
    }
    return files
  } catch {
    return []
  }
}

function matchesPattern(filename: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"))
      return regex.test(filename)
    }
    return filename === pattern || filename.startsWith(pattern + ".")
  })
}

async function getFilesToUpload(options: UploadOptions): Promise<{
  files: string[]
  categories: string[]
}> {
  const uiVersion = await getUiVersion()
  const buildDir = path.join(process.cwd(), "build", uiVersion)
  const allFiles = await listFiles(buildDir)

  let filesToUpload: string[] = []
  let categories: string[] = []

  // Handle presets
  if (options.preset) {
    const preset = PRESETS.find(p => p.name === options.preset)
    if (!preset) {
      throw new Error(`Unknown preset: ${options.preset}`)
    }

    console.log(`Using preset: ${preset.name} - ${preset.description}`)

    // Convert preset to options
    options = {
      ...options,
      cssOnly: preset.categories.includes("css"),
      uiOnly: preset.categories.includes("ui"),
      blocksOnly: preset.categories.includes("blocks"),
      chartsOnly: preset.categories.includes("charts"),
      hooksOnly: preset.categories.includes("hooks"),
      libOnly: preset.categories.includes("lib"),
      examplesOnly: preset.categories.includes("examples"),
      components: preset.components,
      exclude: preset.exclude,
    }
  }

  // CSS files
  if (options.cssOnly || (!options.uiOnly && !options.blocksOnly && !options.chartsOnly && !options.hooksOnly && !options.libOnly && !options.examplesOnly)) {
    const cssFiles = allFiles.filter(f => f.includes("/styles/") && f.endsWith(".css"))
    filesToUpload.push(...cssFiles)
    if (cssFiles.length > 0) categories.push("css")
  }

  // UI components
  if (options.uiOnly || options.components) {
    const uiFiles = allFiles.filter(f => f.includes("/ui/") && f.endsWith(".js"))
    let filteredUiFiles = uiFiles

    if (options.components) {
      filteredUiFiles = uiFiles.filter(f => {
        const filename = path.basename(f, ".js")
        return options.components!.includes(filename)
      })
    }

    filesToUpload.push(...filteredUiFiles)
    if (filteredUiFiles.length > 0) categories.push("ui")
  }

  // Blocks
  if (options.blocksOnly || options.blocks) {
    const blockFiles = allFiles.filter(f => f.includes("/blocks/") && f.endsWith(".js"))
    let filteredBlockFiles = blockFiles

    if (options.blocks) {
      filteredBlockFiles = blockFiles.filter(f => {
        const filename = path.basename(f, ".js")
        return options.blocks!.includes(filename)
      })
    }

    filesToUpload.push(...filteredBlockFiles)
    if (filteredBlockFiles.length > 0) categories.push("blocks")
  }

  // Charts
  if (options.chartsOnly || options.charts) {
    const chartFiles = allFiles.filter(f => f.includes("/charts/") && f.endsWith(".js"))
    let filteredChartFiles = chartFiles

    if (options.charts) {
      filteredChartFiles = chartFiles.filter(f => {
        const filename = path.basename(f, ".js")
        return options.charts!.includes(filename)
      })
    }

    filesToUpload.push(...filteredChartFiles)
    if (filteredChartFiles.length > 0) categories.push("charts")
  }

  // Hooks
  if (options.hooksOnly || options.hooks) {
    const hookFiles = allFiles.filter(f => f.includes("/hooks/") && f.endsWith(".js"))
    let filteredHookFiles = hookFiles

    if (options.hooks) {
      filteredHookFiles = hookFiles.filter(f => {
        const filename = path.basename(f, ".js")
        return options.hooks!.includes(filename)
      })
    }

    filesToUpload.push(...filteredHookFiles)
    if (filteredHookFiles.length > 0) categories.push("hooks")
  }

  // Lib
  if (options.libOnly) {
    const libFiles = allFiles.filter(f => f.includes("/lib/") && f.endsWith(".js"))
    filesToUpload.push(...libFiles)
    if (libFiles.length > 0) categories.push("lib")
  }

  // Examples
  if (options.examplesOnly) {
    const exampleFiles = allFiles.filter(f => f.includes("/examples/") && f.endsWith(".js"))
    filesToUpload.push(...exampleFiles)
    if (exampleFiles.length > 0) categories.push("examples")
  }

  // Apply exclusions
  if (options.exclude && options.exclude.length > 0) {
    filesToUpload = filesToUpload.filter(f => {
      const filename = path.basename(f, path.extname(f))
      return !matchesPattern(filename, options.exclude!)
    })
  }

  // Always include manifest files if we're uploading anything
  if (filesToUpload.length > 0) {
    const manifestFiles = allFiles.filter(f =>
      f.includes("/manifests/") && (f.endsWith(".json"))
    )
    filesToUpload.push(...manifestFiles)
  }

  // Remove duplicates
  filesToUpload = Array.from(new Set(filesToUpload))

  return { files: filesToUpload, categories }
}

function parseArgs(): UploadOptions {
  const args = process.argv.slice(2)
  const options: UploadOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--css-only":
        options.cssOnly = true
        break
      case "--ui-only":
        options.uiOnly = true
        break
      case "--blocks-only":
        options.blocksOnly = true
        break
      case "--charts-only":
        options.chartsOnly = true
        break
      case "--hooks-only":
        options.hooksOnly = true
        break
      case "--lib-only":
        options.libOnly = true
        break
      case "--examples-only":
        options.examplesOnly = true
        break
      case "--components":
        if (i + 1 < args.length) {
          options.components = args[++i].split(",")
        }
        break
      case "--blocks":
        if (i + 1 < args.length) {
          options.blocks = args[++i].split(",")
        }
        break
      case "--charts":
        if (i + 1 < args.length) {
          options.charts = args[++i].split(",")
        }
        break
      case "--hooks":
        if (i + 1 < args.length) {
          options.hooks = args[++i].split(",")
        }
        break
      case "--exclude":
        if (i + 1 < args.length) {
          options.exclude = args[++i].split(",")
        }
        break
      case "--preset":
        if (i + 1 < args.length) {
          options.preset = args[++i]
        }
        break
      case "--dry-run":
        options.dryRun = true
        break
      case "--help":
        printHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function printHelp() {
  console.log(`
Selective CDN Upload Tool

Usage: npx tsx scripts/selective-upload.ts [options]

Category Options:
  --css-only          Upload only CSS files
  --ui-only           Upload only UI components
  --blocks-only       Upload only blocks
  --charts-only       Upload only charts
  --hooks-only        Upload only hooks
  --lib-only          Upload only lib utilities
  --examples-only     Upload only examples

Specific Selection:
  --components <list> Upload specific components (comma-separated)
  --blocks <list>     Upload specific blocks (comma-separated)
  --charts <list>     Upload specific charts (comma-separated)
  --hooks <list>      Upload specific hooks (comma-separated)
  --exclude <list>    Exclude patterns (comma-separated, supports *)

Presets:
  --preset <name>     Use predefined upload preset

Available Presets:
${PRESETS.map(p => `  ${p.name.padEnd(20)} ${p.description}`).join('\n')}

Other Options:
  --dry-run          Show what would be uploaded without actually uploading
  --help             Show this help message

Examples:
  npx tsx scripts/selective-upload.ts --css-only
  npx tsx scripts/selective-upload.ts --ui-only --components=button,card,input
  npx tsx scripts/selective-upload.ts --blocks-only --exclude=sidebar-*
  npx tsx scripts/selective-upload.ts --preset=essential-ui
  npx tsx scripts/selective-upload.ts --ui-only --hooks-only --lib-only --dry-run
`)
}

async function main() {
  // Load environment variables from .env file
  await loadEnvFile()

  const options = parseArgs()

  // Show help if no options provided
  if (Object.keys(options).length === 0) {
    printHelp()
    return
  }

  try {
    console.log("🔍 Analyzing files to upload...")

    // Build UI first (this ensures we have the latest build)
    console.log("🔨 Building UI components...")
    execSync("npx tsx scripts/build-ui.ts", { stdio: "inherit" })

    // Get files to upload
    const { files, categories } = await getFilesToUpload(options)

    if (files.length === 0) {
      console.log("❌ No files match the specified criteria")
      return
    }

    const uiVersion = await getUiVersion()
    console.log(`📦 UI Version: ${uiVersion}`)
    console.log(`📂 Categories: ${categories.join(", ")}`)
    console.log(`📄 Files to upload: ${files.length}`)

    if (options.dryRun) {
      console.log("\n🔍 Dry run - files that would be uploaded:")
      const buildDir = path.join(process.cwd(), "build", uiVersion)
      files.forEach(file => {
        const relativePath = path.relative(buildDir, file)
        console.log(`  ${relativePath}`)
      })
      return
    }

    // Upload to CDN
    const cdnClient = createCdnClient()
    if (!cdnClient) {
      console.log("❌ No CDN configured, skipping upload.")
      return
    }

    console.log(`\n🚀 Uploading ${files.length} files to CDN...`)
    const buildDir = path.join(process.cwd(), "build", uiVersion)
    const prefixDir = 'mc'

    let uploadedCount = 0
    for (const filePath of files) {
      const rel = path.relative(buildDir, filePath).split(path.sep).join("/")
      const key = `${prefixDir}/${uiVersion}/${rel}`
      const contentType = getContentType(filePath)

      try {
        await cdnClient.putObject(
          key,
          await fs.readFile(filePath),
          contentType,
          "public, max-age=31536000, immutable"
        )
        uploadedCount++

        // Show progress every 10 files
        if (uploadedCount % 10 === 0) {
          console.log(`  📤 Uploaded ${uploadedCount}/${files.length} files...`)
        }
      } catch (error) {
        console.error(`❌ Failed to upload ${key}:`, error)
      }
    }

    console.log(`\n✅ Successfully uploaded ${uploadedCount}/${files.length} files!`)

    if (categories.includes("css")) {
      console.log(`🎨 CSS URL: ${cdnClient.publicUrl(`${prefixDir}/${uiVersion}/styles/globals.css`)}`)
    }

    console.log(`📋 Importmap URL: ${cdnClient.publicUrl(`${prefixDir}/${uiVersion}/importmap.json`)}`)
    console.log(`📄 Manifest URL: ${cdnClient.publicUrl(`${prefixDir}/${uiVersion}/manifest.json`)}`)

  } catch (error) {
    console.error("❌ Selective upload failed:", error)
    process.exit(1)
  }
}

main()
