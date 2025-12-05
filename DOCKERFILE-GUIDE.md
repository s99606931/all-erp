# Dockerfile 설명

이 프로젝트는 서비스 유형에 따라 3가지 Dockerfile을 사용합니다:

## 1. Dockerfile.backend.dev
**용도**: 일반 백엔드 마이크로서비스 (NestJS + Prisma + PostgreSQL)

**사용 서비스**:
- auth-service
- system-service  
- tenant-service
- personnel-service
- payroll-service
- attendance-service
- budget-service
- accounting-service
- settlement-service
- asset-service
- supply-service
- general-affairs-service
- approval-service
- report-service
- notification-service
- file-service

**특징**:
- Debian 기반 (node:22-slim)
- OpenSSL 설치 (Prisma 의존성)
- Prisma Client 생성 포함
- 볼륨 마운트로 Hot Reload 지원

---

## 2. Dockerfile.ai.dev
**용도**: AI 서비스 (NestJS + MongoDB + Milvus)

**사용 서비스**:
- ai-service
- web-admin

**특징**:
- MongoDB + Milvus 사용
- Prisma 불필요
- 가벼운 이미지

---

## 3. Dockerfile.frontend.dev
**용도**: 프론트엔드 애플리케이션 (React + Vite)

**사용 서비스**:
- Shell (Module Federation Host)
- 10개 MFE (Micro Frontend) 앱

**특징**:
- Vite 개발 서버
- Hot Module Replacement (HMR)
- 포트 3000 기본 노출

---

## 사용 방법

### Docker Compose에서 사용
```yaml
services:
  auth-service:
    build:
      context: ..
      dockerfile: Dockerfile.backend.dev
    # ...

  ai-service:
    build:
      context: ..
      dockerfile: Dockerfile.ai.dev
    # ...

  shell:
    build:
      context: apps/frontend/shell
      dockerfile: ../../../Dockerfile.frontend.dev
    # ...
```

### 수동 빌드
```bash
# 백엔드 서비스
docker build -f Dockerfile.backend.dev -t all-erp-backend:dev .

# AI 서비스
docker build -f Dockerfile.ai.dev -t all-erp-ai:dev .

# 프론트엔드
docker build -f Dockerfile.frontend.dev -t all-erp-frontend:dev ./apps/frontend/shell
```

---

## 마이그레이션 가이드

기존 `Dockerfile.dev`에서 새로운 구조로 마이그레이션:

1. **docker-compose.dev.yml** 수정
   ```yaml
   # Before
   dockerfile: Dockerfile.dev
   
   # After (일반 백엔드)
   dockerfile: Dockerfile.backend.dev
   
   # After (AI 서비스)
   dockerfile: Dockerfile.ai.dev
   ```

2. **기존 이미지 삭제**
   ```bash
   docker rmi $(docker images | grep 'dev-environment' | awk '{print $3}')
   ```

3. **재빌드**
   ```bash
   cd dev-environment
   ./start-dev.sh all
   ```
