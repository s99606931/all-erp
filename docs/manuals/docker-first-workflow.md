# Docker-First 개발 워크플로우 가이드

> **중요**: 모든 서비스 개발, 테스트, 운영은 Docker Compose를 통해 수행합니다.

## 1. 개요

이 문서는 All-ERP 프로젝트의 **Docker-First 전략**을 설명합니다. 
로컬 환경에서 `pnpm nx serve`로 직접 실행하지 않고, 모든 서비스를 Docker Compose로 실행하여 환경 일관성을 보장합니다.

## 2. Docker Compose 파일 구조

### 2.1 파일 역할

| 파일 | 용도 | 포함 서비스 |
|------|------|------------|
| `docker-compose.infra.yml` | 인프라 (모든 환경 공통) | PostgreSQL, Redis, RabbitMQ, Milvus, Minio, Etcd |
| `docker-compose.dev.yml` | 개발 환경 (볼륨 마운트 + Hot Reload) | auth-service, system-service, tenant-service... |
| `docker-compose.devops.yml` | DevOps 도구 (선택 사항) | GitLab, Prometheus, Grafana, ELK, Jaeger |
| `docker-compose.prod.yml` | 운영 환경 (빌드된 이미지) | auth-service, system-service, tenant-service... |

### 2.2 네트워크 및 볼륨

- **네트워크**: `all-erp-network` (모든 서비스 공유)
- **볼륨**: `dev-environment/volumes/` 하위에 바인드 마운트 사용
  - PostgreSQL: `./volumes/postgres`
  - Redis: `./volumes/redis`
  - 기타 모든 영구 데이터: `./volumes/[서비스명]`

## 3. 개발 워크플로우

### 3.1 서비스 스캐폴딩 (NestJS)

#### 단계 1: Nx CLI로 앱 생성
```bash
# 예시: auth-service 생성
pnpm nx g @nx/nest:app --directory=apps/system/auth-service --name=auth-service --no-interactive
```

#### 단계 2: 서비스 설정
- `main.ts`: Swagger, ValidationPipe, Health Check 설정
- `app.module.ts`: ConfigModule 로드
- 포트: 환경변수 `PORT` 사용 (기본값 설정)

#### 단계 3: Docker Compose에 추가
`dev-environment/docker-compose.dev.yml`에 서비스 추가:
```yaml
services:
  new-service:
    build:
      context: ..
      dockerfile: Dockerfile.dev
    container_name: all-erp-new-service-dev
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      # ... 기타 환경변수
    ports:
      - "3XXX:3XXX"  # 서비스 포트
    volumes:
      - ../apps:/workspace/apps:cached
      - ../libs:/workspace/libs:cached
      - /workspace/node_modules
    command: pnpm nx serve new-service --host=0.0.0.0
    networks:
      - all-erp-network
    restart: unless-stopped
```

### 3.2 개발 환경 실행

```bash
# 1. 인프라 + 개발 환경 전체 시작
cd dev-environment
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml up -d

# 2. 특정 서비스만 재시작
docker compose -f docker-compose.dev.yml restart auth-service

# 3. 로그 확인
docker compose -f docker-compose.dev.yml logs -f auth-service

# 4. 전체 중지
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml down
```

### 3.3 Hot Reload 검증

Docker Compose는 볼륨 마운트를 통해 소스 코드 변경을 자동으로 감지합니다:
1. 로컬에서 `apps/` 또는 `libs/` 하위 파일 수정
2. 컨테이너 내부에서 Nx가 변경 감지
3. 자동 재컴파일 및 재시작

## 4. 검증 및 테스트

### 4.1 Health Check 확인
```bash
curl http://localhost:3001/api/health  # auth-service
curl http://localhost:3002/api/health  # system-service
```

### 4.2 Swagger UI 접속
- Auth: `http://localhost:3001/api`
- System: `http://localhost:3002/api`
- Tenant: `http://localhost:3006/api`

### 4.3 데이터베이스 접속
```bash
# PostgreSQL
docker compose exec postgres psql -U postgres -d all_erp

# Redis CLI
docker compose exec redis redis-cli
```

## 5. PRD 작성 시 주의사항

### 5.1 "작업 단위 (Work Breakdown)" 섹션
각 PRD의 작업 단위에 다음 단계를 **반드시 포함**해야 합니다:

1. Nx CLI로 앱 생성
2. 서비스 설정 (Swagger, Health Check, ConfigModule)
3. **Docker Compose에 서비스 추가** (`docker-compose.dev.yml` 및 `docker-compose.prod.yml`)
4. **Docker Compose로 실행 및 검증**

### 5.2 "승인 기준 (Acceptance Criteria)" 섹션
검증 방법을 **Docker Compose 기반**으로 명시해야 합니다:

❌ **잘못된 예시**:
```
- [ ] `pnpm nx serve auth-service` 실행 시 정상 동작한다.
```

✅ **올바른 예시**:
```
- [ ] Docker Compose로 서비스를 시작하고 `http://localhost:3001/api`에서 Swagger UI가 표시되어야 한다.
- [ ] `http://localhost:3001/api/health`에서 `{ "status": "ok" }` 응답이 와야 한다.
```

## 6. 트러블슈팅

### 6.1 네트워크 오류
```bash
docker network create all-erp-network
```

### 6.2 볼륨 권한 오류
```bash
sudo chmod -R 777 volumes/  # 개발 환경에서만 사용
```

### 6.3 이미지 재빌드
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

## 7. 참고 문서

- [GEMINI 개발 지침](../../.gemini/GEMINI.md)
- [Project Context](../ai/project_context.md)
- [Multitenancy Architecture](../architecture/multitenancy.md)
