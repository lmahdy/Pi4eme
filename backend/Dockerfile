# syntax=docker/dockerfile:1.6

# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with full devDependencies for build
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build

# Prune dev dependencies for runtime image
RUN npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy compiled output and runtime deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Storage directory used by the app at runtime (e.g. accountant-reports PDFs)
RUN mkdir -p /app/storage/accountant-reports && chown -R app:app /app

USER app

EXPOSE 3000

CMD ["node", "dist/main.js"]
