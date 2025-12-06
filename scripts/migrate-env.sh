#!/bin/bash

# 공통 변수
DB_USER="postgres"
DB_PASS="devpassword123"
DB_HOST="postgres"
DB_PORT="5432"
REDIS_HOST="redis"
REDIS_PORT="6379"
RABBITMQ_HOST="rabbitmq"
RABBITMQ_PORT="5672"

# 서비스 목록 및 설정 (서비스명:DB명:PORT)
SERVICES=(
  "system/auth-service:auth_db:3001"
  "system/system-service:system_db:3002"
  "system/tenant-service:tenant_db:3006"
  "hr/personnel-service:personnel_db:3011"
  "hr/payroll-service:payroll_db:3012"
  "hr/attendance-service:attendance_db:3013"
  "finance/budget-service:budget_db:3021"
  "finance/accounting-service:accounting_db:3022"
  "finance/settlement-service:settlement_db:3023"
  "general/asset-service:asset_db:3031"
  "general/supply-service:supply_db:3032"
  "general/general-affairs-service:general_affairs_db:3033"
  "platform/approval-service:approval_db:3041"
  "platform/report-service:report_db:3042"
  "platform/notification-service:notification_db:3043"
  "platform/file-service:file_db:3044"
)

# AI Service는 별도 처리 (Shared DB 사용 가능성 등)
# ai-service:all_erp:3007

echo "Starting deployment of .env files..."

for entry in "${SERVICES[@]}"; do
  IFS=':' read -r path db_name port <<< "$entry"
  service_name=$(basename "$path")
  dir="apps/$path"
  
  if [ ! -d "$dir" ]; then
    echo "Warning: Directory $dir does not exist. Skipping."
    continue
  fi

  echo "Generating .env for $service_name in $dir..."

  # .env 파일 내용 생성
  cat > "$dir/.env" <<EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
# Container Internal URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${db_name}?schema=public"

# Infrastructure
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
RABBITMQ_HOST=${RABBITMQ_HOST}
RABBITMQ_PORT=${RABBITMQ_PORT}

# Service Specific (Add specific vars if needed)
EOF

    # .env.sample 생성 (값 비움)
  cat > "$dir/.env.sample" <<EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Infrastructure
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
EOF

done

# AI Service 별도 처리 (Milvus 등 포함)
echo "Generating .env for ai-service..."
if [ -d "apps/ai/ai-service" ]; then
  cat > "apps/ai/ai-service/.env" <<EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/all_erp?schema=public"

# Infrastructure
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
RABBITMQ_HOST=${RABBITMQ_HOST}
RABBITMQ_PORT=${RABBITMQ_PORT}

# Vector DB
MILVUS_HOST=milvus
MILVUS_PORT=19530
EOF
fi

# File Service 별도 처리 (Minio 포함)
echo "Updating .env for file-service (Adding Minio)..."
if [ -f "apps/platform/file-service/.env" ]; then
  cat >> "apps/platform/file-service/.env" <<EOF

# Object Storage (Minio)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
EOF
fi

# Auth Service 별도 처리 (JWT)
echo "Updating .env for auth-service (Adding JWT)..."
if [ -f "apps/system/auth-service/.env" ]; then
  cat >> "apps/system/auth-service/.env" <<EOF

# Security
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRATION=1h
EOF
fi

echo "All .env files generated successfully."
