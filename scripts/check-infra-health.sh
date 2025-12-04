#!/bin/bash

echo "🏥 인프라 헬스 체크 시작..."

# PostgreSQL 체크 (단일 컨테이너)
if docker exec all-erp-postgres pg_isready -U postgres &>/dev/null; then
  echo "✅ PostgreSQL (all-erp-postgres)"
  
  # 17개 데이터베이스 확인
  DBS="auth_db system_db tenant_db personnel_db payroll_db attendance_db budget_db accounting_db settlement_db asset_db supply_db general_affairs_db approval_db report_db notification_db file_db"
  
  for db in $DBS; do
    if docker exec all-erp-postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $db; then
      echo "  ✅ $db"
    else
      echo "  ❌ $db (미생성)"
    fi
  done
else
  echo "❌ PostgreSQL (all-erp-postgres)"
fi

# MongoDB 체크
if docker exec all-erp-mongo mongosh --quiet --eval "db.adminCommand('ping')" &>/dev/null; then
  echo "✅ MongoDB (all-erp-mongo)"
else
  echo "❌ MongoDB (all-erp-mongo)"
fi

# Redis 체크
if docker exec all-erp-redis redis-cli ping &>/dev/null; then
  echo "✅ Redis (all-erp-redis)"
else
  echo "❌ Redis (all-erp-redis)"
fi

# RabbitMQ 체크
if docker exec all-erp-rabbitmq rabbitmq-diagnostics -q ping &>/dev/null; then
  echo "✅ RabbitMQ (all-erp-rabbitmq)"
else
  echo "❌ RabbitMQ (all-erp-rabbitmq)"
fi

# Minio 체크
if curl -s http://localhost:9000/minio/health/live &>/dev/null; then
  echo "✅ Minio (all-erp-minio)"
else
  echo "❌ Minio (all-erp-minio)"
fi

# Milvus 체크
if curl -s http://localhost:9091/healthz &>/dev/null; then
  echo "✅ Milvus (all-erp-milvus)"
else
  echo "❌ Milvus (all-erp-milvus)"
fi

echo "✅ 헬스 체크 완료"
