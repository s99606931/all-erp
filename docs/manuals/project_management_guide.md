# Project Structure Review & Management Optimization Guide

## 1. 현재 구조 분석 (Current State Analysis)

현재 프로젝트는 **Enterprise급 MSA(Microservices Architecture)** 구조를 갖추고 있으며, 다음과 같은 특징이 있습니다.

- **Backend**: 17개 이상의 NestJS 서비스 (Database per Service 패턴 적용).
- **Frontend**: React 19 기반 Micro Frontend (Shell + 10 Remote Apps).
- **Infrastructure**: Docker Compose 기반의 복잡한 환경 (PostgreSQL, RabbitMQ, Redis, MongoDB, Milvus, Minio 등).
- **Codebase**: Nx Monorepo로 통합 관리.

### 👍 잘된 점

- **Nx Monorepo**: 코드 공유(`libs/`)와 의존성 관리가 체계적임.
- **Docker-First**: 개발 환경이 Docker로 표준화되어 있음.
- **Documentation**: `docs/` 하위에 작업 이력(tasks)이 잘 기록되어 있음.

### ⚠️ 개선 필요 사항 (Pain Points)

1.  **실행 복잡도**: 전체 시스템을 띄우기 위해 `docker-compose` 명령어가 너무 긺 (`-f infra -f dev ...`).
2.  **상태 파악 어려움**: 30개 가까운 컨테이너 중 무엇이 죽었는지, 로그는 어디를 봐야 하는지 한눈에 파악하기 힘듦.
3.  **문서 내비게이션**: `docs/tasks`에 파일이 너무 많아 신규 입사자가 "무엇부터 봐야 할지" 알기 어려움.

---

## 2. 최적화 방안 (Optimization Strategy)

### 전략 1: Unified Management CLI (`./erp`) 도입

복잡한 Docker Compose 명령어를 추상화한 단일 진입점 스크립트를 도입합니다.

**Script Path**: `/data/all-erp/erp` (Executable)

```bash
#!/bin/bash

# Usage: ./erp [command] [service]

COMPOSE_FILES="-f dev-environment/docker-compose.infra.yml -f dev-environment/docker-compose.dev.yml -f dev-environment/docker-compose.frontend.yml"

case "$1" in
  start)
    echo "🚀 Starting All-ERP System..."
    docker compose $COMPOSE_FILES up -d $2
    ;;
  stop)
    echo "🛑 Stopping System..."
    docker compose $COMPOSE_FILES down
    ;;
  restart)
    echo "🔄 Restarting..."
    docker compose $COMPOSE_FILES restart $2
    ;;
  logs)
    docker compose $COMPOSE_FILES logs -f $2
    ;;
  ps)
    docker compose $COMPOSE_FILES ps
    ;;
  build)
    echo "🛠 Building..."
    docker compose $COMPOSE_FILES build $2
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|ps|build} [service_name]"
    exit 1
    ;;
esac
```

**효과**:

- `./erp start`: 전체 기동
- `./erp start auth-service`: 특정 서비스만 기동
- `./erp logs shell`: 쉘 앱 로그 확인

### 전략 2: Documentation Center (`docs/README.md` 개편)

`docs/` 폴더를 단순 파일 저장소가 아닌 **지식 포털**로 만듭니다.

- **`docs/README.md`**: 내비게이션 역할 (Map).
- **`docs/architecture/`**: 시스템 설계도 보관.
- **`docs/manuals/`**: 운영/개발 매뉴얼 (기존 guides 통합).
- **`docs/archive/`**: 완료된 옛날 Task 문서 이동 (폴더 정리).

### 전략 3: Interactive Dashboard (Optional)

터미널 기반의 대시보드 도구인 `lazydocker` 도입을 추천합니다.
실시간으로 컨테이너 상태, 로그, 리소스를 시각적으로 확인할 수 있어 MSA 환경 관리에 필수적입니다.

---

## 3. Action Plan (실행 계획)

1.  **CLI 스크립트 생성**: root에 `erp` 스크립트 생성 및 실행 권한 부여 (즉시 적용 가능).
2.  **문서 정리**: 완료된 Task 문서들을 `docs/tasks-archive`로 이동하여 `Active Task`만 남김.
3.  **Health Check Script**: 전체 서비스가 정상적으로 떴는지 확인하는 스크립트 작성 (`scripts/health-check.sh`).
