#!/bin/bash

OUTPUT_FILE="dev-environment/docker-compose.prod.yml"

# Header
cat > "$OUTPUT_FILE" <<EOF
# [Production Simulation] 운영 환경 시뮬레이션
# 각 서비스는 독립적인 Dockerfile(Production)로 빌드됩니다.
# 사용법: docker compose -f docker-compose.infra.yml -f docker-compose.prod.yml up -d --build

services:
EOF

# 서비스 목록 (path:port)
# 포트는 Dev와 동일하게 매핑하여 접근성 유지
SERVICES=(
  "system/auth-service:3001"
  "system/system-service:3002"
  "system/tenant-service:3006"
  "hr/personnel-service:3011"
  "hr/payroll-service:3012"
  "hr/attendance-service:3013"
  "finance/budget-service:3021"
  "finance/accounting-service:3022"
  "finance/settlement-service:3023"
  "general/asset-service:3031"
  "general/supply-service:3032"
  "general/general-affairs-service:3033"
  "platform/approval-service:3041"
  "platform/report-service:3042"
  "platform/notification-service:3043"
  "platform/file-service:3044"
  "ai/ai-service:3007"
)

for entry in "${SERVICES[@]}"; do
  IFS=':' read -r path port <<< "$entry"
  service_name=$(basename "$path")
  container_name="all-erp-${service_name}-prod"

  echo "Adding $service_name to prod compose..."

  cat >> "$OUTPUT_FILE" <<EOF
  ${service_name}:
    build:
      context: ..
      dockerfile: apps/${path}/Dockerfile
    container_name: ${container_name}
    env_file:
      - ../apps/${path}/.env
    ports:
      - "${port}:${port}"
      # Note: Production app usually listens on 3000 inside, but our .env sets PORT=3000.
      # However, we must map host_port:container_port.
      # If .env has PORT=3000, container listens on 3000.
      # So mapping should be "${port}:3000".
      # Let's fix .env PORT variable assumption.
    networks:
      - all-erp-network
    restart: always

EOF
done

# Network Definition
cat >> "$OUTPUT_FILE" <<EOF
networks:
  all-erp-network:
    name: all-erp-network
    external: true
EOF

# 수정: 포트 매핑 수정 (3000 포트 표준화 반영)
# 위 루프에서 ${port}:${port}로 썼는데, .env 생성 시 PORT=3000으로 고정했음 (Step 146).
# 따라서 호스트 포트는 ${port} (예: 3001), 컨테이너 포트는 3000이어야 함.
# sed로 일괄 수정
sed -i 's/\([0-9]\{4\}\):\1/\1:3000/g' "$OUTPUT_FILE"

echo "docker-compose.prod.yml generated at $OUTPUT_FILE"
