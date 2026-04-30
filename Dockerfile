# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- Stage 2: Build application ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Dummy DATABASE_URL so Drizzle module loads without error during build.
# No actual connection is made — dynamic pages are not pre-rendered.
ENV DATABASE_URL="postgres://build:build@localhost:5432/build"
RUN npm run build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
# Copy drizzle migrations for auto-migrate on startup
COPY --from=builder /app/src/db/migrations ./src/db/migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
# Copy drizzle-kit binary for running migrations
COPY --from=builder /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=builder /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild

# Ensure storage directories exist and are owned by nextjs
RUN mkdir -p /app/storage/assets /app/storage/sites && \
    chown -R nextjs:nodejs /app/storage

VOLUME /app/storage

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "node node_modules/drizzle-kit/bin.cjs migrate && node server.js"]
