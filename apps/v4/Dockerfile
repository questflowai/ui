# Multi-stage Dockerfile for v4 Next.js application
# This Dockerfile is optimized for the shadcn/ui v4 project structure

# Stage 1: Dependencies
FROM node:20-alpine AS deps
LABEL maintainer="shadcn"
LABEL description="Dependencies stage for v4 application"

# Install system dependencies required for node-gyp and other native modules
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.0.6 --activate

# Copy package files for dependency installation
# We need to copy the entire monorepo structure due to workspaces
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/v4/package.json ./apps/v4/
COPY packages/shadcn/package.json ./packages/shadcn/
COPY packages/tests/package.json ./packages/tests/

# Install dependencies only
RUN pnpm install --frozen-lockfile --production=false

# Stage 2: Build
FROM node:20-alpine AS builder
LABEL description="Build stage for v4 application"

# Install system dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.0.6 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./

# Copy source code
COPY . .

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the shadcn package first (required dependency)
RUN pnpm --filter=shadcn build

# Build the v4 application
WORKDIR /app/apps/v4
RUN pnpm build

# Stage 3: Runtime
FROM node:20-alpine AS runner
LABEL description="Production runtime for v4 application"

# Install system dependencies for runtime
RUN apk add --no-cache \
    dumb-init \
    curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=4000

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/static ./apps/v4/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/public ./apps/v4/public

# Copy registry files (needed for the application)
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/registry ./apps/v4/registry

# Create a non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/health || exit 1

# Expose port
EXPOSE 4000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "apps/v4/server.js"]