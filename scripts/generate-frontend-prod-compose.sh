#!/bin/bash

OUTPUT_FILE="dev-environment/docker-compose.frontend.prod.yml"

# Header
cat > "$OUTPUT_FILE" <<EOF
# [Frontend Production Simulation] 운영 환경 시뮬레이션
# 각 앱은 Nginx 기반의 Prod Dockerfile로 빌드됩니다.
# 사용법: docker compose -f docker-compose.infra.yml -f docker-compose.frontend.prod.yml up -d --build

services:
EOF

# Frontend 앱 목록 및 포트 (Host Port)
# 앱 내부(Nginx)는 80번 포트를 사용하므로, HostPort:80 매핑
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

for entry in "${APPS[@]}"; do
  app_name="${entry%%:*}"
  port="${entry#*:}"
  container_name="all-erp-${app_name}-prod"

  echo "Adding $app_name to frontend prod compose..."

  cat >> "$OUTPUT_FILE" <<EOF
  ${app_name}:
    build:
      context: ..
      dockerfile: apps/frontend/${app_name}/Dockerfile
    container_name: ${container_name}
    env_file:
      - ../apps/frontend/${app_name}/.env
    ports:
      - "${port}:80"
    networks:
      - all-erp-network
    restart: always

EOF
done

# Network Definition (**Correction: all-erp-network must match existing definitions**)
# Step 202 showed 'networks: all-erp-network: external: true'.
# Just use 'erp-network'.

cat >> "$OUTPUT_FILE" <<EOF
networks:
  all-erp-network:
    external: true
EOF

echo "docker-compose.frontend.prod.yml generated at $OUTPUT_FILE"
