# TASK-P1-04: Docker Compose 인프라 설정

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 0.5주
- **우선순위**: Medium
- **선행 작업**: TASK-P1-03 (데이터 마이그레이션 완료)

## 🎯 목표

단일 PostgreSQL 컨테이너(17개 독립 DB) + MongoDB + RabbitMQ + Redis + Minio를 포함한 완전한 인프라 Docker Compose 설정을 완성합니다.

## 📝 상세 작업 내용

### 1. 완전한 docker-compose.infra.yml

**dev-environment/docker-compose.infra.yml** (기존 설정 기반):
```yaml
# 인프라 서비스만 포함 (PostgreSQL, MongoDB, Redis, RabbitMQ, Milvus 등)

services:
  # PostgreSQL 단일 컨테이너 (17개 독립 데이터베이스)
  postgres:
    image: postgres:17-alpine
    container_name: all-erp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-devpassword123}
      POSTGRES_DB: ${DB_DATABASE:-all_erp}
      TZ: ${TZ:-Asia/Seoul}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - ./volumes/postgres:/var/lib/postgresql/data
      - ./config/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - all-erp-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB (ai-service용)
  mongo:
    image: mongo:7
    container_name: all-erp-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: ai_db
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME:-mongo}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-devpassword123}
    ports:
      - "27017:27017"
    volumes:
      - ./volumes/mongo:/data/db
    networks:
      - all-erp-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (캐싱 및 세션)
  redis:
    image: redis:8-alpine
    container_name: all-erp-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - ./volumes/redis:/data
      - ./config/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - all-erp-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # RabbitMQ (이벤트 버스)
  rabbitmq:
    image: rabbitmq:4-management-alpine
    container_name: all-erp-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-admin}
    ports:
      - "${RABBITMQ_PORT:-5672}:5672"
      - "15672:15672"
    volumes:
      - ./volumes/rabbitmq:/var/lib/rabbitmq
      - ./config/rabbitmq/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    networks:
      - all-erp-network
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 30s
      retries: 3

  # etcd (Milvus 의존성)
  etcd:
    image: quay.io/coreos/etcd:v3.6.6
    container_name: all-erp-etcd
    restart: unless-stopped
    environment:
      ETCD_AUTO_COMPACTION_MODE: revision
      ETCD_AUTO_COMPACTION_RETENTION: "1000"
      ETCD_QUOTA_BACKEND_BYTES: "4294967296"
      ETCD_SNAPSHOT_COUNT: "50000"
      ETCD_LISTEN_CLIENT_URLS: http://0.0.0.0:2379
      ETCD_ADVERTISE_CLIENT_URLS: http://etcd:2379
      ETCD_DATA_DIR: /etcd
    volumes:
      - ./volumes/etcd:/etcd
    networks:
      - all-erp-network

  # Minio (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: all-erp-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - ./volumes/minio:/minio_data
    command: minio server /minio_data --console-address ":9001"
    networks:
      - all-erp-network

  # Milvus (벡터 DB for AI)
  milvus:
    image: milvusdb/milvus:v2.6.6
    container_name: all-erp-milvus
    restart: unless-stopped
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    ports:
      - "19530:19530"
      - "9091:9091"
    volumes:
      - ./volumes/milvus:/var/lib/milvus
    command: milvus run standalone
    depends_on:
      - etcd
      - minio
    networks:
      - all-erp-network

networks:
  all-erp-network:
    name: all-erp-network
    driver: bridge
```

### 2. 환경 변수 템플릿

**dev-environment/.env** (기존 파일 활용):
```bash
# PostgreSQL
DB_USERNAME=postgres
DB_PASSWORD=devpassword123
DB_DATABASE=all_erp
DB_PORT=5432
TZ=Asia/Seoul

# MongoDB
MONGO_USERNAME=mongo
MONGO_PASSWORD=devpassword123

# Redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin
RABBITMQ_PORT=5672

# Minio
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

> **중요**: 프로덕션 환경에서는 강력한 비밀번호로 변경 필수!

### 3. 헬스 체크 스크립트

**scripts/check-infra-health.sh**:
```bash
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
```

### 4. 시작/중지 스크립트

**scripts/start-infra.sh**:
```bash
#!/bin/bash

cd dev-environment

echo "🚀 인프라 시작 중..."

docker compose -f docker-compose.infra.yml up -d

echo "⏳ 서비스 준비 대기 중..."
sleep 10

../scripts/check-infra-health.sh
```

**scripts/stop-infra.sh**:
```bash
#!/bin/bash

cd dev-environment

echo "🛑 인프라 중지 중..."

docker compose -f docker-compose.infra.yml down

echo "✅ 인프라 중지 완료"
```

## ✅ 완료 조건

- [ ] `docker-compose.infra.yml` 완성 (기존 설정 활용)
- [ ] PostgreSQL 컨테이너 + 17개 DB 생성 확인
- [ ] MongoDB + RabbitMQ + Redis + Minio + Milvus + etcd 모두 포함
- [ ] 헬스 체크 설정 완료
- [ ] 환경 변수 설정 확인
- [ ] 시작/중지/헬스체크 스크립트 작성
- [ ] `docker compose up -d` 실행 성공
- [ ] 모든 서비스 헬스 체크 통과

## 🔧 실행 명령어

```bash
# 인프라 시작
./scripts/start-infra.sh

# 헬스 체크
./scripts/check-infra-health.sh

# 인프라 중지
./scripts/stop-infra.sh

# 로그 확인
cd dev-environment
docker compose -f docker-compose.infra.yml logs -f
```

## 📚 참고 문서

- [Docker Compose 공식 문서](https://docs.docker.com/compose/)

## 🚨 주의사항

- **리소스 효율성**: 단일 PostgreSQL 컨테이너 사용으로 메모리/CPU 효율 향상
- **데이터 격리**: 논리적 데이터베이스 분리로 서비스 독립성 유지
- **보안**: 프로덕션 환경에서는 .env 파일을 Git에 커밋하지 말 것
- **헬스 체크**: 모든 서비스의 헬스 체크 필수 (의존성 관리)
- **볼륨 마운트**: 데이터 영속성 보장
- **네트워크**: `all-erp-network`로 통일하여 서비스 간 통신 원활화
