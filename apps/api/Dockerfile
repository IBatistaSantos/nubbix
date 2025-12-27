FROM oven/bun:1.3.4-slim AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN bun install

FROM oven/bun:1.3.4-slim AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock* ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/turbo.json ./

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:' + (process.env.PORT || 3001) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENV NODE_ENV=production
ENV PORT=3001

CMD ["bun", "run", "apps/api/index.ts"]
