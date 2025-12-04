# TASK-P1-04: Docker Compose 인프라 설정

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 0.5주
- **우선순위**: Medium
- **선행 작업**: TASK-P1-03 (데이터 마이그레이션 완료)

## 🎯 목표

17개 DB + RabbitMQ + Redis + Minio를 포함한 완전한 인프라 Docker Compose 설정을 완성합니다.

## 📝 상세 작업 내용

### 1. 완전한 docker-compose.infra.yml

**dev-environment/docker-compose.infra.yml**:
```yaml
version: '3.8'

services:
  # PostgreSQL 인스턴스 (16개)
  postgres-auth:
    image: postgres:16-alpine
    container_name: postgres-auth
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    ports:
      - "5432:5432"
    volumes:
      - postgres-auth-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres-system:
    image: postgres:16-alpine
    container_name: postgres-system
    environment:
      POSTGRES_DB: system_db
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    ports:
      - "5433:5432"
    volumes:
      - postgres-system-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ... 나머지 14개 PostgreSQL 인스턴스 (tenant, personnel, payroll, etc.)

  # MongoDB (ai-service용)
  mongo-ai:
    image: mongo:7
    container_name: mongo-ai
    environment:
      MONGO_INITDB_DATABASE: ai_db
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-mongo}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-password}
    ports:
      - "27017:27017"
    volumes:
      - mongo-ai-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: redis
    command: redis-server --requirepass ${REDIS_PASSWORD:-password}
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-guest}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS:-guest}
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # Management UI
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Minio (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD:-minioadmin}
    ports:
      - "9000:9000"    # API
      - "9001:9001"    # Console
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-auth-data:
  postgres-system-data:
  postgres-tenant-data:
  postgres-personnel-data:
  postgres-payroll-data:
  postgres-attendance-data:
  postgres-budget-data:
  postgres-accounting-data:
  postgres-settlement-data:
  postgres-asset-data:
  postgres-supply-data:
  postgres-general-affairs-data:
  postgres-approval-data:
  postgres-report-data:
  postgres-notification-data:
  postgres-file-data:
  mongo-ai-data:
  redis-data:
  rabbitmq-data:
  minio-data:

networks:
  default:
    name: erp-network
    driver: bridge
```

### 2. 환경 변수 템플릿

**dev-environment/.env.infra**:
```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev_password_change_in_prod

# MongoDB
MONGO_USER=mongo
MONGO_PASSWORD=dev_password_change_in_prod

# Redis
REDIS_PASSWORD=dev_password_change_in_prod

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

# Minio
MINIO_USER=minioadmin
MINIO_PASSWORD=dev_password_change_in_prod
```

### 3. 헬스 체크 스크립트

**scripts/check-infra-health.sh**:
```bash
#!/bin/bash

echo "🏥 인프라 헬스 체크 시작..."

# PostgreSQL 체크
for port in 5432 5433 5434 5435 5436 5437 5438 5439 5440 5441 5442 5443 5444 5445 5446 5447; do
  if docker exec -it postgres-auth pg_isready -p $port &>/dev/null; then
    echo "✅ PostgreSQL :$port"
  else
    echo "❌ PostgreSQL :$port"
  fi
done

# MongoDB 체크
if docker exec -it mongo-ai mongosh --eval "db.adminCommand('ping')" &>/dev/null; then
  echo "✅ MongoDB :27017"
else
  echo "❌ MongoDB :27017"
fi

# Redis 체크
if docker exec -it redis redis-cli ping &>/dev/null; then
  echo "✅ Redis :6379"
else
  echo "❌ Redis :6379"
fi

# RabbitMQ 체크
if curl -s http://localhost:15672 &>/dev/null; then
  echo "✅ RabbitMQ :15672"
else
  echo "❌ RabbitMQ :15672"
fi

# Minio 체크
if curl -s http://localhost:9000/minio/health/live &>/dev/null; then
  echo "✅ Minio :9000"
else
  echo "❌ Minio :9000"
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

- [ ] `docker-compose.infra.yml` 완성
- [ ] 17개 DB + RabbitMQ + Redis + Minio 모두 포함
- [ ] 헬스 체크 설정 완료
- [ ] 환경 변수 템플릿 작성
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

- 운영 환경에서는 환경 변수 파일을 Git에 커밋하지 말 것
- 헬스 체크는 필수 (의존성 관리)
- 볼륨 마운트로 데이터 영속성 보장
- 네트워크는 `erp-network`로 통일
