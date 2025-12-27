FROM oven/bun:1.3.4-slim AS deps
WORKDIR /app

# Copy all workspace files needed for dependency resolution
COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/
COPY turbo.json ./

# Install dependencies (this layer will be cached if package files don't change)
RUN bun install --frozen-lockfile

FROM oven/bun:1.3.4-slim AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/bun.lock* ./

# Copy source code and config files
COPY packages ./packages
COPY apps/api ./apps/api
COPY turbo.json ./

# Build the application
RUN bun run apps/api/build || echo "No build script, skipping"

FROM oven/bun:1.3.4-slim AS production
WORKDIR /app

# Copy only production dependencies
COPY --from=deps /app/package.json ./
COPY --from=deps /app/bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy built application and necessary files
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/turbo.json ./

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:' + (process.env.PORT || 3001) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENV NODE_ENV=production
ENV PORT=3001

CMD ["bun", "run", "apps/api/index.ts"]
