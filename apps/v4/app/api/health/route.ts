import { NextResponse } from "next/server"

/**
 * Health check endpoint for container monitoring
 * Returns 200 OK if the application is running properly
 */
export async function GET() {
  try {
    // Basic health check - you can add more sophisticated checks here
    // such as database connectivity, external service availability, etc.
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || "unknown",
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}
