# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# Copy source and config
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma client and build TypeScript
RUN pnpm exec prisma generate && pnpm run build

# Prisma client is required at dist/generated (resolved from dist/lib)
RUN cp -r /app/src/generated /app/dist/

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 expressjs

# Copy built app (includes dist/generated from Prisma)
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma

# Copy production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER expressjs

EXPOSE 3000

# Migrations (e.g. prisma migrate deploy) can be run as an init container or entrypoint script
CMD ["node", "dist/index.js"]
