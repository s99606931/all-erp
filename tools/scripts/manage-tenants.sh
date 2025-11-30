#!/bin/bash

# ==============================================================================
# 테넌트 관리 스크립트 (Tenant Management Script)
#
# [용도]
# 이 스크립트는 SaaS ERP 시스템의 멀티테넌시 환경에서 개별 테넌트(고객사)를 위한
# 데이터베이스 스키마를 생성하고 관리하는 데 사용됩니다.
#
# [기능]
# 1. create: 새로운 테넌트를 위한 전용 스키마를 생성하고 초기 마이그레이션을 수행합니다.
# 2. migrate: 기존 테넌트 스키마에 최신 DB 변경 사항(Migration)을 반영합니다.
#
# [사용법]
# ./manage-tenants.sh [명령어] [테넌트ID]
#
# 예시:
# ./manage-tenants.sh create samsung  (samsung 테넌트 생성)
# ./manage-tenants.sh migrate lg      (lg 테넌트 마이그레이션)
# ==============================================================================

COMMAND=$1
TENANT_ID=$2

if [ -z "$COMMAND" ]; then
  echo "사용법: $0 [create|migrate] [tenant_id]"
  exit 1
fi

function create_tenant() {
  echo "테넌트 생성 시작: $TENANT_ID"
  
  # 1. DB에 스키마 생성 (PostgreSQL)
  # 실제 환경에서는 DB 접속 정보를 환경변수에서 가져와야 합니다.
  # docker compose exec postgres psql -U user -d erp -c "CREATE SCHEMA \"$TENANT_ID\";"
  
  # 2. 마이그레이션 실행
  # 해당 스키마에 대해 Prisma 마이그레이션을 적용합니다.
  # pnpm prisma migrate deploy --schema=./prisma/schema.prisma
  
  echo "테넌트 '$TENANT_ID' 생성이 완료되었습니다. (시뮬레이션)"
}

function migrate_tenant() {
  echo "테넌트 마이그레이션 시작: $TENANT_ID"
  
  # 특정 테넌트 또는 전체 테넌트에 대해 마이그레이션을 반복 수행하는 로직이 필요합니다.
  echo "테넌트 '$TENANT_ID'에 대한 마이그레이션이 적용되었습니다. (시뮬레이션)"
}

case $COMMAND in
  create)
    create_tenant
    ;;
  migrate)
    migrate_tenant
    ;;
  *)
    echo "알 수 없는 명령어입니다: $COMMAND"
    echo "사용 가능한 명령어: create, migrate"
    exit 1
    ;;
esac
