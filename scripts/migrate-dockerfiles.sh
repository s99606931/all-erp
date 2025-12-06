#!/bin/bash

# 서비스 목록 (path:service_name)
SERVICES=(
  "system/auth-service"
  "system/system-service"
  "system/tenant-service"
  "hr/personnel-service"
  "hr/payroll-service"
  "hr/attendance-service"
  "finance/budget-service"
  "finance/accounting-service"
  "finance/settlement-service"
  "general/asset-service"
  "general/supply-service"
  "general/general-affairs-service"
  "platform/approval-service"
  "platform/report-service"
  "platform/notification-service"
  "platform/file-service"
  "ai/ai-service"
)

echo "Starting Dockerfile migration..."

for path in "${SERVICES[@]}"; do
  service_name=$(basename "$path")
  dir="apps/$path"
  
  if [ ! -d "$dir" ]; then
    echo "Warning: Directory $dir does not exist. Skipping."
    continue
  fi

  echo "Processing $service_name in $dir..."

  # 1. Create Dockerfile (Production)
  # pnpm deploy 기반 최적화 빌드
  cat > "$dir/Dockerfile" <<EOF
# [Production] $service_name Dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="\$PNPM_HOME:\$PATH"
RUN corepack enable

# Pruner: Extract only necessary packages for this service
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm --filter $service_name --prod deploy pruned

# Builder: Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build $service_name --prod

# Runner: Final production image
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install system dependencies (openssl for Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy built artifacts
# Note: Adjust source path if your nx build output differs
COPY --from=builder /app/dist/apps/$path ./dist
COPY --from=pruner /app/pruned/node_modules ./node_modules
COPY --from=pruner /app/pruned/package.json ./package.json

CMD ["node", "dist/main.js"]
EOF

  # 2. Create Dockerfile.dev (Development)
  # Based on Dockerfile.backend.dev
  cat > "$dir/Dockerfile.dev" <<EOF
# [Development] $service_name Dockerfile
# Context must be project root
FROM node:22-slim

WORKDIR /workspace

# Install system dependencies (Prisma, etc)
RUN apt-get update && \\
    apt-get install -y openssl libssl-dev ca-certificates && \\
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configs (Context Root)
COPY package.json pnpm-lock.yaml ./
COPY nx.json tsconfig.base.json ./
# Prisma configs might be needed if postinstall runs generate
COPY libs/shared/infra/prisma ./libs/shared/infra/prisma
# Service specific schema if exists (handled by volume usually, but good for caching)

# Install dependencies
RUN pnpm install --frozen-lockfile

# Source code is mounted via Volumes in docker-compose
CMD ["sh", "-c", "echo 'Use docker-compose command'"]
EOF

done

echo "All Dockerfiles generated successfully."
