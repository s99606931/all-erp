# Docker Compose 개발 워크플로우 가이드

> ✨ **핵심 원칙**: 모든 개발, 테스트, 운영은 Docker Compose 기반으로 진행합니다.

## 🎯 개발 전략

### 기본 철학
- **일관성**: 로컬, 테스트, 운영 환경의 차이 최소화
- **격리**: 각 서비스는 독립된 컨테이너에서 실행
- **생산성**: 볼륨 마운트 + Hot Reload로 빠른 개발

### 환경 구분

| 환경 | Compose 파일 | 특징 | 용도 |
|------|-------------|------|------|
| **인프라** | `docker-compose.infra.yml` | PostgreSQL, Redis 등 | 모든 환경의 기반 |
| **DevOps** | `docker-compose.devops.yml` | GitLab, Prometheus 등 | 필요시 추가 |
| **개발** | `docker-compose.dev.yml` | 볼륨 마운트, Hot Reload | 일상 개발 |
| **운영** | `docker-compose.prod.yml` | 빌드된 이미지, 최적화 | 프로덕션 |

**핵심 개념**:
- **인프라 먼저**: 개발/운영 모두 `infra.yml` 선행 실행
- **조합 가능**: 여러 파일을 `-f` 옵션으로 조합
- **네트워크 공유**: 모두 `all-erp-network` 사용

---

## 🚀 개발 시작하기

### 1. 환경 설정

```bash
# 프로젝트 루트로 이동
cd /data/all-erp

# 환경 변수 파일 복사
cp envs/development.env .env
```

### 2. 인프라 시작 (필수)

```bash
# dev-environment 디렉토리로 이동
cd dev-environment

# 인프라 먼저 시작 (DB, Redis 등)
docker compose -f docker-compose.infra.yml up -d

# 상태 확인
docker compose -f docker-compose.infra.yml ps
```

### 3. 개발 환경 시작

```bash
# 방법 1: 인프라 + 개발 환경 한번에
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml up -d

# 방법 2: 개발 환경만 (인프라가 이미 실행 중일 때)
docker compose -f docker-compose.dev.yml up -d

# DevOps 도구도 필요하면
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml -f docker-compose.devops.yml up -d
```

### 4. 로그 확인

```bash
# 전체 로그 (인프라 + 개발)
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml logs -f

# 특정 서비스만
docker compose -f docker-compose.dev.yml logs -f auth-service

# Hot Reload 작동 확인
# 소스 코드 변경 시 "Restarting..." 메시지 확인
```

### 4. 개발 진행

```bash
# 1. 로컬에서 소스 코드 수정
# vim /data/all-erp/apps/auth-service/src/main.ts

# 2. 자동으로 컨테이너에 반영 (볼륨 마운트)
# 3. Hot Reload로 자동 재시작
# 4. 브라우저에서 즉시 확인 가능
```


## 🔧 주요 명령어

### 서비스 관리

```bash
# 상태 확인
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml ps

# 특정 서비스 재시작
docker compose -f docker-compose.dev.yml restart auth-service

# 인프라 중지 (개발 환경은 유지)
docker compose -f docker-compose.infra.yml stop

# 개발 환경 중지
docker compose -f docker-compose.dev.yml stop

# 전체 중지
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml stop

# 서비스 제거 (데이터 유지)
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml down

# 서비스 제거 (데이터 포함, ⚠️ 주의!)
docker compose -f docker-compose.infra.yml down -v
```

### 컨테이너 접속

```bash
# 컨테이너 셸 접속
docker compose -f docker-compose.dev.yml exec auth-service sh

# DB 접속
docker compose -f docker-compose.infra.yml exec postgres psql -U postgres -d all_erp
```

### 이미지 재빌드

```bash
# 개발 서비스 재빌드
docker compose -f docker-compose.dev.yml build auth-service

# 캐시 없이 재빌드
docker compose -f docker-compose.dev.yml build --no-cache auth-service

# 전체 재빌드
docker compose -f docker-compose.dev.yml build
```

---

## 🐛 디버깅

### VSCode 디버거 연결

**`.vscode/launch.json` 설정:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Auth Service",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/workspace",
      "protocol": "inspector",
      "restart": true
    }
  ]
}
```

**디버깅 시작:**
1. `docker-compose.dev.yml`이 실행 중인지 확인
2. VSCode에서 F5 또는 Debug 메뉴 클릭
3. 브레이크포인트 설정 후 API 호출

---

## 📦 의존성 관리

### 새 패키지 설치

```bash
# 1. 로컬에서 패키지 설치
cd /data/all-erp
pnpm add <package-name>

# 2. 컨테이너 재빌드
cd dev-environment
docker compose -f docker-compose.dev.yml build auth-service
docker compose -f docker-compose.dev.yml up -d auth-service
```

---

## ✅ 접속 확인

### 주요 서비스 엔드포인트

| 서비스 | 주소 | 설명 |
|--------|------|------|
| Auth Service | http://localhost:3001 | 인증/인가 API |
| Auth Swagger | http://localhost:3001/api/docs | API 문서 |
| System Service | http://localhost:3002 | 시스템 API |
| PostgreSQL | localhost:5432 | DB 연결 |
| Redis | localhost:6379 | 캐시 |
| RabbitMQ UI | http://localhost:15672 | 메시지 큐 관리 |

### Health Check

```bash
# Auth Service
curl http://localhost:3001/health

# System Service
curl http://localhost:3002/health
```


## 🔄 일상 워크플로우

### 아침 (시작)

```bash
cd /data/all-erp/dev-environment

# 인프라 + 개발 환경 시작
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml up -d
```

### 개발 중

```bash
# 소스 수정 → 자동 반영 (볼륨 마운트)
# Hot Reload 작동 → 컨테이너 자동 재시작
# 브라우저 새로고침 → 변경 사항 즉시 확인
```

### 퇴근 (종료)

```bash
cd /data/all-erp/dev-environment

# 개발 환경만 중지 (인프라는 유지)
docker compose -f docker-compose.dev.yml stop

# 또는 전체 중지
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml stop
```

---

## 🚨 트러블슈팅

### 문제: Hot Reload가 작동하지 않음

**해결:**
```bash
# 1. 볼륨 마운트 확인
docker compose -f docker-compose.dev.yml exec auth-service ls -la /workspace/apps

# 2. 서비스 재시작
docker compose -f docker-compose.dev.yml restart auth-service
```

### 문제: 포트 충돌

**해결:**
```bash
# 기존 프로세스 종료
sudo lsof -ti:3001 | xargs kill -9

# 또는 .env에서 포트 변경
AUTH_SERVICE_PORT=3101
```

### 문제: 컨테이너가 시작되지 않음

**해결:**
```bash
# 로그 확인
docker compose -f docker-compose.dev.yml logs auth-service

# 이미지 재빌드
docker compose -f docker-compose.dev.yml build --no-cache auth-service
```

---

## 📚 추가 참고사항

- **볼륨 마운트**: 로컬 소스(`apps/`, `libs/`)가 컨테이너에 실시간 반영
- **node_modules 격리**: 컨테이너 내부 `node_modules` 사용으로 OS 간 호환성 문제 방지
- **디버깅 포트**: 각 서비스마다 고유한 디버깅 포트 할당 (9229, 9230, 9231...)
- **Health Check**: 의존성 서비스(DB, Redis) 준비 완료 후 앱 시작
