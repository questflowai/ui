import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

/* Multi-cloud CDN client: AWS S3/CloudFront, Cloudflare R2, Google Cloud Storage/Cloud CDN.
 * Strategy is selected via env:
 *   - CDN_STRATEGY = s3 | r2 | gcs
 *   - CDN_BASE_URL = https://cdn.example.com
 *
 * S3 / R2:
 *   - AWS_S3_BUCKET
 *   - AWS_REGION (S3), for R2 may use "auto" or any, or leave unset if endpoint handles it
 *   - S3_ENDPOINT (optional, required for R2: https://<accountid>.r2.cloudflarestorage.com)
 *   - S3_FORCE_PATH_STYLE = true (recommended for R2/MinIO)
 *   - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (or use IAM in runtime)
 *
 * GCS:
 *   - GCS_BUCKET
 *   - GOOGLE_APPLICATION_CREDENTIALS (path) or GOOGLE_CREDENTIALS_JSON (inline JSON)
 *   - GOOGLE_PROJECT_ID (optional if creds include project_id)
 */

export type CdnClient = {
  putObject: (
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
    cacheControl?: string
  ) => Promise<void>
  publicUrl: (key: string) => string
}

function ensureBaseUrl(baseUrl: string | undefined): string {
  if (!baseUrl)
    throw new Error("CDN_BASE_URL is required when using CDN_STRATEGY")
  return baseUrl.replace(/\/$/, "")
}

function normalizeKey(key: string): string {
  return key.replace(/^\/+/, "")
}

function toBuffer(body: Buffer | Uint8Array | string): Buffer | Uint8Array {
  return typeof body === "string" ? Buffer.from(body) : body
}

export function createCdnClient(): CdnClient | null {
  const strategy = (process.env.CDN_STRATEGY || "").toLowerCase()
  const baseUrl = process.env.CDN_BASE_URL

  if (!strategy) {
    // No CDN strategy configured - fallback to local mock (return null to signal local writes)
    return null
  }

  if (strategy === "s3" || strategy === "r2") {
    const bucket = process.env.AWS_S3_BUCKET
    if (!bucket) throw new Error("AWS_S3_BUCKET is required for S3/R2 strategy")
    const endpoint = process.env.S3_ENDPOINT // R2/MinIO require endpoint
    const forcePathStyle =
      String(
        process.env.S3_FORCE_PATH_STYLE ||
          (strategy === "r2" ? "true" : "false")
      ) === "true"
    const region = strategy === "r2" ? "auto" : process.env.AWS_REGION
    const base = ensureBaseUrl(baseUrl)

    return {
      async putObject(key, body, contentType, cacheControl) {
        const client = new S3Client({
          region,
          endpoint: endpoint || undefined,
          // forcePathStyle,
          credentials:
            process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
              ? {
                  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
                }
              : undefined,
        })
        const Key = normalizeKey(key)
        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key,
            Body: toBuffer(body),
            ContentType: contentType,
            CacheControl: cacheControl,
          })
        )
        console.log(`Uploaded to ${bucket}/${Key}`)
      },
      publicUrl(key) {
        return `${base}/${normalizeKey(key)}`
      },
    }
  }

  if (strategy === "gcs") {
    const bucketName = process.env.GCS_BUCKET
    if (!bucketName) throw new Error("GCS_BUCKET is required for GCS strategy")
    const base = ensureBaseUrl(baseUrl)

    return {
      async putObject(key, body, contentType, cacheControl) {
        const { Storage } = await import("@google-cloud/storage")
        let options: any = {}
        // Prefer GOOGLE_CREDENTIALS_JSON if provided
        if (process.env.GOOGLE_CREDENTIALS_JSON) {
          try {
            const json = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
            options.projectId = process.env.GOOGLE_PROJECT_ID || json.project_id
            options.credentials = {
              client_email: json.client_email,
              private_key: json.private_key,
            }
          } catch (e) {
            throw new Error("Invalid GOOGLE_CREDENTIALS_JSON")
          }
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          // Path will be read by SDK automatically; optionally pass projectId
          if (process.env.GOOGLE_PROJECT_ID) {
            options.projectId = process.env.GOOGLE_PROJECT_ID
          }
        }
        const storage = new Storage(options)
        const file = storage.bucket(bucketName).file(normalizeKey(key))
        await file.save(toBuffer(body) as Buffer, {
          contentType,
          metadata: cacheControl ? { cacheControl } : undefined,
          resumable: false,
          validation: false,
        })
      },
      publicUrl(key) {
        return `${base}/${normalizeKey(key)}`
      },
    }
  }

  throw new Error(`Unsupported CDN_STRATEGY=${strategy}`)
}
