import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"

import { createCdnClient } from "./cdn"

const BUILD_UI_DIR = path.join(
  process.cwd(),
  "build",
  "apps",
  "v4",
  "registry",
  "new-york-v4"
)

async function getUiVersion(): Promise<string> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "apps", "v4", "package.json"),
        "utf-8"
      )
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
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
    case ".jfif":
      return "image/jpeg"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"
    case ".ico":
      return "image/x-icon"
    case ".avif":
      return "image/avif"
    case ".woff":
      return "font/woff"
    case ".woff2":
      return "font/woff2"
    case ".ttf":
      return "font/ttf"
    case ".otf":
      return "font/otf"
    case ".eot":
      return "application/vnd.ms-fontobject"
    case ".xml":
      return "application/xml"
    default:
      return "application/octet-stream"
  }
}

async function listFiles(dir: string): Promise<string[]> {
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
}

async function main() {
  // 1. Build the UI
  console.log("Building UI...")
  execSync("npx tsx scripts/build-ui.ts", { stdio: "inherit" })

  // 2. Upload to CDN
  const cdnClient = createCdnClient()
  if (!cdnClient) {
    console.log("No CDN configured, skipping upload.")
    return
  }

  const uiVersion = await getUiVersion()
  console.log(`Uploading UI version: ${uiVersion}`)

  // Upload component files
  const buildDir = path.join(process.cwd(), "build", uiVersion,)
  const componentFiles = await listFiles(buildDir)

  console.log(`Uploading ${componentFiles.length} component files to CDN...`)
  const prefixDir = 'mc'
  for (const filePath of componentFiles) {
    const rel = path.relative(buildDir, filePath).split(path.sep).join("/")
    // micro components
    const key = `${prefixDir}/${uiVersion}/${rel}`
    const contentType = getContentType(filePath)

    await cdnClient.putObject(
      key,
      await fs.readFile(filePath),
      contentType,
      "public, max-age=31536000, immutable"
    )
  }


  console.log("CDN upload complete!")
  console.log(`Importmap URL: ${cdnClient.publicUrl(`${prefixDir}/${uiVersion}/importmap.json`)}`)
  console.log(`Manifest URL: ${cdnClient.publicUrl(`${prefixDir}/${uiVersion}/manifest.json`)}`)
}

main().catch((error) => {
  console.error("Release failed:", error)
  process.exit(1)
})
