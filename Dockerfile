# Multi-stage build for Next.js app with pnpm workspace

# Stage 1: Base image with Node.js and pnpm
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.6

# Set working directory
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS deps

# Copy root package files for pnpm workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all workspaces
COPY packages/shadcn/package.json ./packages/shadcn/
COPY apps/v4/package.json ./apps/v4/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build stage
FROM base AS builder

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shadcn/node_modules ./packages/shadcn/node_modules
COPY --from=deps /app/apps/v4/node_modules ./apps/v4/node_modules

# Copy source code
COPY . .

# Build shadcn package first (required dependency for v4)
RUN pnpm --filter=shadcn build

# Build v4 application
RUN pnpm --filter=v4 build

# Stage 4: Production runtime
FROM node:20-alpine AS runner

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy the standalone output from Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/static ./apps/v4/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/public ./apps/v4/public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 4000

# Set environment variables
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "apps/v4/server.js"]
