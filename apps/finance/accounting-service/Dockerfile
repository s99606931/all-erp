# [Production] accounting-service Dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Pruner: Extract only necessary packages for this service
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm --filter accounting-service --prod deploy pruned

# Builder: Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build accounting-service --prod

# Runner: Final production image
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install system dependencies (openssl for Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy built artifacts
# Note: Adjust source path if your nx build output differs
COPY --from=builder /app/dist/apps/finance/accounting-service ./dist
COPY --from=pruner /app/pruned/node_modules ./node_modules
COPY --from=pruner /app/pruned/package.json ./package.json

CMD ["node", "dist/main.js"]
