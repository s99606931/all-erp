#!/bin/bash

# Define array of frontend apps (excluding shell which is already done)
APPS=("accounting-mfe" "asset-mfe" "attendance-mfe" "budget-mfe" "general-affairs-mfe" "hr-mfe" "inventory-mfe" "payroll-mfe" "system-mfe" "treasury-mfe")

PROJECT_ROOT="/data/all-erp"
COMPOSE_FILE="$PROJECT_ROOT/dev-environment/docker-compose.frontend.dev.yml"

echo "🚀 Starting Frontend Docker Fix..."

for app in "${APPS[@]}"; do
    echo "Processing $app..."
    DOCKERFILE="$PROJECT_ROOT/apps/frontend/$app/Dockerfile.dev"
    
    # Rewrite Dockerfile.dev
    if [ -f "$DOCKERFILE" ]; then
        cat > "$DOCKERFILE" <<EOF
# [Development] $app Dockerfile
FROM node:22-slim

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root configs for dependencies
COPY package.json pnpm-lock.yaml* nx.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# App logic
# Note: Port might vary, but dev server usually allows configured port. 
# We expose 3000-42xx depending on app, but Dockerfile EXPOSE is information.
EXPOSE 4200 

CMD ["pnpm", "nx", "serve", "$app", "--host", "0.0.0.0"]
EOF
        echo "  ✨ Updated Dockerfile.dev"
    else
        echo "  ⚠️  Dockerfile.dev not found for $app"
    fi
done

echo "Updating docker-compose.frontend.dev.yml..."

# Use perl for multiline replacement because sed is messy with newlines
# Replace volume mapping: ../apps/frontend/XXX:/app -> ../apps:/workspace/apps:cached\n      - ../libs:/workspace/libs:cached
# Replace volume mapping: /app/node_modules -> /workspace/node_modules

# 1. Replace app source mount
# We verify if we match the old pattern strictly to avoid double replace
perl -i -pe 's{volumes:}{volumes:}g' "$COMPOSE_FILE" # No-op to check access
perl -i -0777 -pe 's{-\s+\.\./apps/frontend/([\w-]+):/app}{- ../apps:/workspace/apps:cached\n      - ../libs:/workspace/libs:cached}g' "$COMPOSE_FILE"

# 2. Replace node_modules mount
perl -i -pe 's{- /app/node_modules}{- /workspace/node_modules}g' "$COMPOSE_FILE"

echo "🎉 Frontend Fix Complete."
