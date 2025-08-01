# Use multi-stage build for optimal image size
FROM node:20.5.1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install pnpm and clear npm cache to ensure clean state
RUN npm install -g pnpm@9.0.6 && \
    npm cache clean --force && \
    pnpm config set store-dir ~/.pnpm-store

WORKDIR /app

# Copy package.json files and pnpm workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY apps/v4/package.json ./apps/v4/
COPY packages/shadcn/package.json ./packages/shadcn/ 

# Copy root tsconfig.json and shadcn package source code and build config
COPY tsconfig.json ./
COPY packages/shadcn/src/ ./packages/shadcn/src/
COPY packages/shadcn/tsup.config.ts ./packages/shadcn/
COPY packages/shadcn/tsconfig.json ./packages/shadcn/

# Install build dependencies for shadcn package (including devDependencies)
RUN pnpm install --frozen-lockfile --filter=shadcn --include=dev

# Build shadcn package to create dist/index.js before installing all dependencies
RUN pnpm --filter=shadcn build

# Verify the build was successful by checking if dist/index.js exists
RUN ls -la /app/packages/shadcn/dist/ && test -f /app/packages/shadcn/dist/index.js

# Copy necessary config files for fumadocs-mdx postinstall
COPY apps/v4/next.config.mjs ./apps/v4/
COPY apps/v4/source.config.ts ./apps/v4/
COPY apps/v4/tsconfig.json ./apps/v4/
COPY apps/v4/mdx-components.tsx ./apps/v4/
COPY apps/v4/content/ ./apps/v4/content/
COPY apps/v4/lib/ ./apps/v4/lib/

# Install all dependencies now that shadcn package is built
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm and clear npm cache to ensure clean state
RUN npm install -g pnpm@9.0.6 && \
    npm cache clean --force && \
    pnpm config set store-dir ~/.pnpm-store

# Copy dependencies and built shadcn package from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/v4/node_modules ./apps/v4/node_modules
COPY --from=deps /app/packages/shadcn/node_modules ./packages/shadcn/node_modules
COPY --from=deps /app/packages/shadcn/dist ./packages/shadcn/dist

# Copy all source code
COPY . .

# Build the v4 Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter=v4 build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/apps/v4/public ./apps/v4/public

# Set the correct permission for prerender cache
RUN mkdir -p ./apps/v4/.next
RUN chown nextjs:nodejs ./apps/v4/.next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/static ./apps/v4/.next/static

# Copy built shadcn package
COPY --from=builder /app/packages/shadcn/dist ./packages/shadcn/dist

USER nextjs

EXPOSE 4000

ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/v4/server.js"]