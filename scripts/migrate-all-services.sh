#!/bin/bash
# Prisma 마이그레이션 일괄 실행 스크립트

set -e  # 에러 발생 시 중단

echo "🚀 Prisma 마이그레이션 시작..."
echo ""

# PostgreSQL 비밀번호
PG_PASSWORD="devpassword123"
PG_HOST="localhost"
PG_PORT="5432"
PG_USER="postgres"

# 서비스별 마이그레이션 함수
migrate_service() {
  local service_path=$1
  local db_name=$2
  local service_name=$3
  
  echo "📦 $service_name 마이그레이션 중..."
  
  # 절대 경로로 이동
  cd "/data/all-erp/$service_path"
  
  # DATABASE_URL 환경 변수 설정
  export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${db_name}"
  
  echo "   DB: $db_name"
  echo "   Schema: ./prisma/schema.prisma"
  
  # Prisma 실행 파일 경로
  PRISMA_BIN="/data/all-erp/node_modules/.bin/prisma"

  # Prisma Client 생성 (절대 경로 사용)
  $PRISMA_BIN generate --schema="$PWD/prisma/schema.prisma"
  
  # 마이그레이션 실행 (절대 경로 사용)
  $PRISMA_BIN migrate dev --name init --schema="$PWD/prisma/schema.prisma"
  
  echo "✅ $service_name 완료"
  echo ""
  
  cd /data/all-erp
}

# System Domain
migrate_service "apps/system/auth-service" "auth_db" "auth-service"
migrate_service "apps/system/system-service" "system_db" "system-service"
migrate_service "apps/system/tenant-service" "tenant_db" "tenant-service"
migrate_service "apps/system/approval-service" "approval_db" "approval-service"
migrate_service "apps/system/report-service" "report_db" "report-service"
migrate_service "apps/system/notification-service" "notification_db" "notification-service"
migrate_service "apps/system/file-service" "file_db" "file-service"

# HR Domain
migrate_service "apps/hr/personnel-service" "personnel_db" "personnel-service"
migrate_service "apps/hr/payroll-service" "payroll_db" "payroll-service"
migrate_service "apps/hr/attendance-service" "attendance_db" "attendance-service"

# Finance Domain
migrate_service "apps/finance/budget-service" "budget_db" "budget-service"
migrate_service "apps/finance/accounting-service" "accounting_db" "accounting-service"
migrate_service "apps/finance/settlement-service" "settlement_db" "settlement-service"

# General Domain
migrate_service "apps/general/asset-service" "asset_db" "asset-service"
migrate_service "apps/general/supply-service" "supply_db" "supply-service"
migrate_service "apps/general/general-affairs-service" "general_affairs_db" "general-affairs-service"

echo "🎉 모든 마이그레이션 완료!"
echo ""
echo "생성된 데이터베이스:"
echo "- auth_db, system_db, tenant_db"
echo "- personnel_db, payroll_db, attendance_db"
echo "- budget_db, accounting_db, settlement_db"
echo "- asset_db, supply_db, general_affairs_db"
echo "- approval_db, report_db, notification_db, file_db"
