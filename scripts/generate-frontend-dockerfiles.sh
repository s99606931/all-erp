#!/bin/bash

# Frontend 앱 목록 및 포트 설정
APPS=(
  "shell:3000"
  "system-mfe:3100"
  "hr-mfe:3101"
  "payroll-mfe:3102"
  "attendance-mfe:3103"
  "budget-mfe:3104"
  "treasury-mfe:3105"
  "accounting-mfe:3106"
  "asset-mfe:3107"
  "inventory-mfe:3108"
  "general-affairs-mfe:3109"
)

echo "Starting Frontend Dockerfile generation..."

for entry in "${APPS[@]}"; do
  app_name="${entry%%:*}"
  port="${entry#*:}"
  
  dir="apps/frontend/$app_name"
  
  if [ ! -d "$dir" ]; then
    echo "Warning: Directory $dir does not exist. Skipping."
    continue
  fi

  echo "Processing $app_name (Port: $port) in $dir..."

  # 1. Create Dockerfile (Production)
  # Multi-stage build: Node Build -> Nginx Serve
  cat > "$dir/Dockerfile" <<EOF
# [Production] $app_name Dockerfile
FROM node:22-slim AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy all source code (Monorepo context)
COPY . .

# Install dependencies (Full install required for build)
RUN pnpm install --frozen-lockfile

# Build the specific app
# Output usually goes to dist/apps/frontend/$app_name
RUN pnpm nx build $app_name --prod

# Runner Stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist/apps/frontend/$app_name /usr/share/nginx/html

# Nginx Configuration for SPA (React Router support)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files \$uri \$uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

  # 2. Create Dockerfile.dev (Development)
  # Based on Dockerfile.frontend.dev but simplified for per-app usage
  cat > "$dir/Dockerfile.dev" <<EOF
# [Development] $app_name Dockerfile
FROM node:22-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root configs for dependencies
# Context: Root (..)
COPY package.json pnpm-lock.yaml* nx.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# App logic
EXPOSE $port

# Start Dev Server
# Note: Source code is mounted at /app/apps/frontend/$app_name map to /app ? 
# Wait, docker-compose volume maps '../apps/frontend/$app_name:/app'
# So inside container, /app IS the app directory.
# BUT package.json copy above put root package.json in /app.
# This volume mount OVERWRITES /app content with app source.
# So root package.json is LOST? 
# YES.
# FIX: WORKDIR should be /workspace (Root) and mount app to /workspace/apps/frontend/$app_name?
# OR: Keep current volume strategy but accept risk?
# Existing Strategy in docker-compose.frontend.yml calls for volume: ../apps/frontend/shell:/app.
# And Dockerfile.frontend.dev COPY package.json ./ (Response 206).
# If /app is overwritten, 'node_modules' volume saves deps.
# But 'package.json' (Root) is lost.
# However, 'pnpm dev' runs inside /app (App Dir). It sees App's package.json.
# It works because Dev Server doesn't need Root package.json at runtime if node_modules are present.
# So we keep the strategy.

CMD ["pnpm", "nx", "serve", "$app_name", "--host", "0.0.0.0"]
EOF

done

echo "Frontend Dockerfiles generated successfully."
