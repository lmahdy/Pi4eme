# syntax=docker/dockerfile:1.6

# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json ./
COPY src ./src

# Production build (Angular 17 application builder outputs to dist/frontend/browser)
RUN npx ng build --configuration production

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# Replace default nginx config with SPA-aware one
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular assets
COPY --from=builder /app/dist/frontend/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
