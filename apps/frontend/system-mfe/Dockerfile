# [Production] system-mfe Dockerfile
FROM node:22-slim AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy all source code (Monorepo context)
COPY . .

# Install dependencies (Full install required for build)
RUN pnpm install --frozen-lockfile

# Build the specific app
# Output usually goes to dist/apps/frontend/system-mfe
RUN pnpm nx build system-mfe --prod

# Runner Stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist/apps/frontend/system-mfe /usr/share/nginx/html

# Nginx Configuration for SPA (React Router support)
RUN echo 'server {   listen 80;   location / {     root /usr/share/nginx/html;     index index.html;     try_files $uri $uri/ /index.html;   } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
