import fs from "node:fs/promises"
import path from "node:path"

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

interface Config {
  environment: {
    required: string[]
    optional: string[]
  }
}

async function loadConfig(): Promise<Config> {
  try {
    const configPath = path.join(process.cwd(), "upload-config.json")
    const configContent = await fs.readFile(configPath, "utf-8")
    return JSON.parse(configContent)
  } catch (error) {
    console.error("❌ Failed to load upload-config.json:", error)
    process.exit(1)
  }
}

function checkEnvironmentVariables(config: Config): {
  isValid: boolean
  missing: string[]
  present: string[]
} {
  const missing: string[] = []
  const present: string[] = []

  // Check required variables
  for (const envVar of config.environment.required) {
    if (process.env[envVar]) {
      present.push(envVar)
    } else {
      missing.push(envVar)
    }
  }

  // Check optional variables (just for info)
  for (const envVar of config.environment.optional) {
    if (process.env[envVar]) {
      present.push(envVar)
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    present
  }
}

function printEnvStatus(result: { isValid: boolean; missing: string[]; present: string[] }) {
  console.log("🔍 Environment Variables Status:")
  console.log("")

  if (result.present.length > 0) {
    console.log("✅ Present variables:")
    result.present.forEach(env => {
      const value = process.env[env]
      const displayValue = value && value.length > 20
        ? `${value.substring(0, 20)}...`
        : value
      console.log(`  ${env} = ${displayValue}`)
    })
    console.log("")
  }

  if (result.missing.length > 0) {
    console.log("❌ Missing required variables:")
    result.missing.forEach(env => {
      console.log(`  ${env}`)
    })
    console.log("")
  }

  return result.isValid
}

function printEnvHelp() {
  console.log("📋 Environment Variable Setup Guide:")
  console.log("")
  console.log("Required variables:")
  console.log("  CDN_STRATEGY     - CDN provider: 's3', 'r2', or 'gcs'")
  console.log("  CDN_BASE_URL     - Base URL for your CDN (e.g., https://cdn.example.com)")
  console.log("")
  console.log("For AWS S3 / Cloudflare R2:")
  console.log("  AWS_S3_BUCKET           - S3 bucket name")
  console.log("  AWS_REGION              - AWS region (or 'auto' for R2)")
  console.log("  AWS_ACCESS_KEY_ID       - AWS access key")
  console.log("  AWS_SECRET_ACCESS_KEY   - AWS secret key")
  console.log("  S3_ENDPOINT             - Custom endpoint (required for R2)")
  console.log("  S3_FORCE_PATH_STYLE     - Set to 'true' for R2/MinIO")
  console.log("")
  console.log("For Google Cloud Storage:")
  console.log("  GCS_BUCKET                    - GCS bucket name")
  console.log("  GOOGLE_APPLICATION_CREDENTIALS - Path to service account JSON")
  console.log("  GOOGLE_CREDENTIALS_JSON       - Inline service account JSON")
  console.log("  GOOGLE_PROJECT_ID             - Google Cloud project ID")
  console.log("")
  console.log("Example .env file:")
  console.log("  CDN_STRATEGY=s3")
  console.log("  CDN_BASE_URL=https://cdn.example.com")
  console.log("  AWS_S3_BUCKET=my-ui-bucket")
  console.log("  AWS_REGION=us-east-1")
  console.log("  AWS_ACCESS_KEY_ID=your-access-key")
  console.log("  AWS_SECRET_ACCESS_KEY=your-secret-key")
}

async function main() {
  // Load environment variables from .env file
  await loadEnvFile()

  const args = process.argv.slice(2)
  const showHelp = args.includes("--help") || args.includes("-h")

  if (showHelp) {
    printEnvHelp()
    return
  }

  try {
    const config = await loadConfig()
    const result = checkEnvironmentVariables(config)
    const isValid = printEnvStatus(result)

    if (!isValid) {
      console.log("💡 Run 'npm run check-env -- --help' for setup instructions")
      process.exit(1)
    } else {
      console.log("✅ Environment is properly configured for CDN uploads!")
    }
  } catch (error) {
    console.error("❌ Environment check failed:", error)
    process.exit(1)
  }
}

main()
