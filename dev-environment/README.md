# ALL-ERP 개발 환경

> 💡 **Docker Compose 기반 개발 환경**  
> 모든 개발, 테스트, 운영이 Docker Compose로 통일되어 환경 간 일관성을 보장합니다.

## 🚀 빠른 시작

### ⚡ 개발 환경 시작

```bash
# 1. dev-environment 디렉토리로 이동
cd dev-environment

# 2. 개발 환경 시작 (인프라 + 애플리케이션)
./start-dev.sh

# 또는 수동 실행
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml up -d
```

### 🛑 개발 환경 중지

```bash
# 스크립트 사용 (선택 가능)
./stop-dev.sh

# 또는 수동 중지
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml stop
```

---

## 📁 폴더 구조

```
dev-environment/
├── docker-compose.infra.yml   # 인프라 (PostgreSQL, Redis 등)
├── docker-compose.devops.yml  # DevOps 도구 (GitLab, Grafana 등)
├── docker-compose.dev.yml     # 개발 환경 (애플리케이션)
├── docker-compose.prod.yml    # 운영 환경 (빌드된 이미지)
├── config/                    # 서비스 설정 (Git 관리)
├── volumes/                   # 데이터 저장소 (Git 제외)
├── start-dev.sh               # 시작 스크립트
├── stop-dev.sh                # 중지 스크립트
└── GETTING-STARTED.md         # ⭐ 전체 구축 가이드
```

---

## 🎯 Compose 파일 역할

### 1. `docker-compose.infra.yml` - 인프라 (필수)

모든 환경의 기반이 되는 인프라 서비스

```bash
docker compose -f docker-compose.infra.yml up -d
```

**포함 서비스**:
- PostgreSQL (DB)
- Redis (캐시)
- RabbitMQ (메시지 큐)
- Milvus, etcd, MinIO (Vector DB)


### 2. `docker-compose.devops.yml` - DevOps 도구 (선택)

모니터링, 로깅, CI/CD 도구

```bash
docker compose -f docker-compose.devops.yml up -d
```

**포함 서비스**:
- GitLab (Git 저장소 + CI/CD)
- Prometheus + Grafana (모니터링)
- ELK Stack (로깅)
- Jaeger (분산 추적)

### 3. `docker-compose.dev.yml` - 개발 환경 (일상 사용)

애플리케이션 서비스 (볼륨 마운트 + Hot Reload)

```bash
docker compose -f docker-compose.dev.yml up -d
```

**포함 서비스**:
- auth-service, system-service, tenant-service

### 4. `docker-compose.prod.yml` - 운영 환경

빌드된 이미지로 실행 (최적화)

---

## 🔧 주요 서비스 접속 정보

| 카테고리 | 서비스 | 접속 주소 | 계정 |
|---|---|---|---|
| **인프라** | PostgreSQL | localhost:5432 | postgres / devpassword123 |
| | Redis | localhost:6379 | - |
| | RabbitMQ | http://localhost:15672 | admin / admin |
| | MinIO | http://localhost:9001 | minioadmin / minioadmin |
| **애플리케이션** | Auth Service | http://localhost:3001 | - |
| | System Service | http://localhost:3002 | - |
| | Tenant Service | http://localhost:3006 | - |
| **DevOps** | GitLab | http://localhost:8980 | root / changeme123! |
| | Grafana | http://localhost:3000 | admin / admin |
| | Prometheus | http://localhost:9090 | - |
| | Kibana | http://localhost:5601 | - |

---

## 🔄 관리 명령어

```bash
# 상태 확인
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml ps

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f auth-service

# 특정 서비스 재시작
docker compose -f docker-compose.dev.yml restart auth-service

# 전체 중지
./stop-dev.sh
# 또는
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml stop

# 전체 중지
./stop-dev.sh

# 데이터까지 초기화 (주의!)
docker compose down -v
```


### 기존 환경 사용

```bash
# WSL 실행
wsl

# 작업 디렉토리
cd /data/allsharp/dev-environment

# 인프라 시작
./start-dev.sh

# 개발 시작
cd .. && pnpm nx serve auth-service
```

---

## 📁 파일 구조

```
dev-environment/
├── docker-compose.yml     # 통합 Compose 파일
├── config/                # 서비스 설정 (Git 관리)
├── volumes/               # 데이터 저장소 (Git 제외)
├── envs/                  # 환경별 설정
├── .env.example           # 환경 변수 템플릿
├── start-dev.sh           # 시작 스크립트
├── stop-dev.sh            # 중지 스크립트
├── GETTING-STARTED.md     # 전체 구축 가이드 ⭐
├── WSL2-UBUNTU-SETUP.md   # WSL 상세 설정
├── DEVOPS-SETUP.md        # DevOps 도구 가이드
└── FOLDER-STRUCTURE.md    # 폴더 구조 설명
```

---

## 🎯 실행 모드 (Docker Compose Profiles)

### 기본 인프라만 (권장)

```bash
./start-dev.sh
# 또는
docker compose --profile infra up -d
```

**서비스**: PostgreSQL, Redis, RabbitMQ, Milvus, etcd, MinIO

### DevOps 도구 추가

```bash
docker compose --profile devops up -d
```

**서비스**: GitLab, Prometheus, Grafana, ELK, Jaeger, Nginx

### 전체 실행

```bash
docker compose --profile all up -d
```

---

## 🔧 주요 서비스

### 기본 인프라

| 서비스 | 주소 | 계정 |
|---------|------|------|
| PostgreSQL | `localhost:5432` | postgres/devpassword123 |
| Redis | `localhost:6379` | - |
| RabbitMQ | `http://localhost:15672` | admin/admin |
| MinIO | `http://localhost:9001` | minioadmin/minioadmin |

### DevOps 도구

| 서비스 | 주소 | 계정 |
|---------|------|------|
| GitLab | `http://localhost:8980` | root/changeme123! |
| Prometheus | `http://localhost:9090` | - |
| Grafana | `http://localhost:3000` | admin/admin |
| Kibana | `http://localhost:5601` | - |

---

## 🔄 서비스 관리

```bash
# 상태 확인
docker compose ps

# 특정 서비스 재시작
docker compose restart postgres

# 로그 확인
docker compose logs -f postgres

# 전체 중지
./stop-dev.sh
```

---

## 🪟 Windows에서 접근

```powershell
# PowerShell (관리자 권한)
New-Item -ItemType SymbolicLink -Path "D:\wsl-allsharp" -Target "\\wsl$\Ubuntu-24.04\data\allsharp"
```

---

## 📚 문서

- **[전체 구축 가이드 (필독!)](./GETTING-STARTED.md)**
- [WSL2 Ubuntu 설치](./WSL2-UBUNTU-SETUP.md)
- [DevOps 도구 설정](./DEVOPS-SETUP.md)
- [폴더 구조 설명](./FOLDER-STRUCTURE.md)

## 🚀 빠른 시작

### 1. WSL2 Ubuntu 24.04 설치

**자세한 가이드**: [WSL2-UBUNTU-SETUP.md](./WSL2-UBUNTU-SETUP.md)

### 2. 작업 디렉토리 이동

```bash
cd /data/allsharp/dev-environment
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
nano .env  # 필요 시 수정
```

### 4. 서비스 실행

```bash
chmod +x start-dev.sh stop-dev.sh

# 기본 인프라만 (권장 - 일상 개발)
./start-dev.sh

# 또는 수동 실행
docker compose --profile infra up -d
```

---

## 📁 파일 구조

```
dev-environment/
├── docker-compose.yml     # 통합 Compose 파일
├── config/                # 서비스 설정 파일
│   ├── nginx/
│   ├── prometheus/
│   ├── grafana/
│   └── logstash/
├── volumes/               # 데이터 저장소 (Git 제외)
├── envs/                  # 환경별 설정
├── .env.example           # 환경 변수 템플릿
├── start-dev.sh           # 시작 스크립트
└── stop-dev.sh            # 중지 스크립트
```

---

## 🎯 실행 모드 (Profiles)

### 옵션 1: 기본 인프라만 (권장)

```bash
./start-dev.sh
# 또는
docker compose --profile infra up -d
```

**포함 서비스**: PostgreSQL, Redis, RabbitMQ, Milvus, etcd, MinIO

### 옵션 2: DevOps 도구 추가

```bash
docker compose --profile devops up -d
```

**추가 서비스**: GitLab, Prometheus, Grafana, ELK, Jaeger, Nginx

### 옵션 3: 전체 실행

```bash
docker compose --profile all up -d
```

**모든 서비스** 한 번에 실행

---

## 🔧 주요 서비스 접속

### 기본 인프라

| 서비스 | 주소 | 계정 |
|---------|------|------|
| PostgreSQL | `localhost:5432` | postgres/devpassword123 |
| Redis | `localhost:6379` | - |
| RabbitMQ | `http://localhost:15672` | admin/admin |
| MinIO | `http://localhost:9001` | minioadmin/minioadmin |

### DevOps 도구

| 서비스 | 주소 | 계정 |
|---------|------|------|
| GitLab | `http://localhost:8980` | root/changeme123! |
| Prometheus | `http://localhost:9090` | - |
| Grafana | `http://localhost:3000` | admin/admin |
| Kibana | `http://localhost:5601` | - |
| Jaeger | `http://localhost:16686` | - |

---

## 💻 개발 워크플로우

### 아침 (시작)

```bash
wsl
cd /data/allsharp/dev-environment
./start-dev.sh
cd .. && pnpm nx serve auth-service
```

### 퇴근 (종료)

```bash
./stop-dev.sh
```

---

## 🔄 서비스 관리

```bash
# 상태 확인
docker compose ps

# 특정 서비스 재시작
docker compose restart postgres

# 로그 확인
docker compose logs -f postgres
```

---

## 🪟 Windows에서 접근

```powershell
# PowerShell (관리자 권한)
New-Item -ItemType SymbolicLink -Path "D:\wsl-allsharp" -Target "\\wsl$\Ubuntu-24.04\data\allsharp"
```

---

## 📚 추가 문서

- [WSL2 설치 가이드](./WSL2-UBUNTU-SETUP.md)
- [DevOps 구성 가이드](./DEVOPS-SETUP.md)
- [폴더 구조 설명](./FOLDER-STRUCTURE.md)

> 💡 **이 폴더는 WSL2 Ubuntu 환경에서만 사용합니다.**  
> Windows에서 개발하지 않습니다. 모든 개발은 WSL 내부에서 진행됩니다.

## 🚀 빠른 시작

### 1. WSL2 Ubuntu 24.04 설치

**자세한 설치 가이드**: [WSL2-UBUNTU-SETUP.md](./WSL2-UBUNTU-SETUP.md)

```powershell
# Windows PowerShell (관리자 권한)
wsl --install -d Ubuntu-24.04
```

### 2. 작업 디렉토리 이동

```bash
# WSL Ubuntu에서
cd /data/allsharp/dev-environment
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
nano .env  # 필요 시 수정
```

### 4. 인프라 시작

```bash
chmod +x start-dev.sh stop-dev.sh
./start-dev.sh
```

### 5. 애플리케이션 개발

```bash
cd /data/allsharp
pnpm install
pnpm nx serve auth-service
```

---

## 📁 파일 구성

```
dev-environment/
├── docker-compose.infra.yml  # 인프라 전용 (PostgreSQL, Redis 등)
├── .env.example              # 환경 변수 템플릿
├── start-dev.sh              # 빠른 시작 스크립트
├── stop-dev.sh               # 중지 스크립트
├── WSL2-UBUNTU-SETUP.md      # 상세 설치 가이드
└── README.md                 # 본 파일
```

---

## 🔧 주요 서비스

인프라 서비스 (`docker-compose.infra.yml`):

| 서비스 | 포트 | 용도 |
|---------|------|------|
| PostgreSQL | 5432 | 메인 DB |
| Redis | 6379 | 캐시, 세션 |
| RabbitMQ | 5672, 15672 | 메시지 큐 |
| Milvus | 19530 | Vector DB (RAG) |
| MinIO | 9000, 9001 | 객체 저장소 |
| etcd | 2379 | Milvus 메타데이터 |

---

## 💻 개발 워크플로우

### 시작 시

```bash
wsl                              # WSL 실행
cd /data/allsharp/dev-environment
./start-dev.sh                   # 인프라 시작
cd .. && pnpm nx serve auth-service
```

### 종료 시

```bash
cd /data/allsharp/dev-environment
./stop-dev.sh
```

---

## 🪟 Windows에서 접근

WSL 경로에 Windows에서 접근하려면:

**방법 1: 심볼릭 링크 (PowerShell 관리자 권한)**
```powershell
New-Item -ItemType SymbolicLink -Path "D:\wsl-allsharp" -Target "\\wsl$\Ubuntu-24.04\data\allsharp"
```

**방법 2: 직접 UNC 경로**
```
\\wsl$\Ubuntu-24.04\data\allsharp
```

---

## 📚 추가 문서

- [WSL2 Ubuntu 설치 가이드](./WSL2-UBUNTU-SETUP.md)
- [환경 변수 가이드](../docs/infrastructure/environment_variables.md)
- [API 설계 가이드](../docs/human/api_design_guide.md)
- [DB 설계 가이드](../docs/human/db_design_guide.md)


본 문서는 Windows 로컬 환경에서 Docker Compose를 사용하여 ALL-ERP 개발 환경을 구축하는 방법을 안내합니다.

## 📋 목차

1. [필수 소프트웨어 설치](#1-필수-소프트웨어-설치)
2. [개발 환경 구조](#2-개발-환경-구조)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [인프라 서비스 실행](#4-인프라-서비스-실행)
5. [애플리케이션 개발 모드](#5-애플리케이션-개발-모드)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. 필수 소프트웨어 설치

### 1.1 Docker Desktop for Windows

**다운로드**: https://www.docker.com/products/docker-desktop

**시스템 요구사항**:
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 이상)
- WSL 2 필수
- 최소 8GB RAM (16GB 권장)

**설치 후 설정**:
```powershell
# WSL 2 백엔드 확인
wsl --set-default-version 2

# Docker Desktop 리소스 설정 (Settings > Resources)
# - CPUs: 4 Core 이상
# - Memory: 8 GB 이상
# - Disk: 100 GB 이상
```

### 1.2 Node.js 22 LTS

**다운로드**: https://nodejs.org/

```powershell
# 설치 확인
node -v  # v22.x.x
npm -v
```

### 1.3 pnpm (패키지 매니저)

```powershell
npm install -g pnpm
pnpm -v  # 9.x.x 이상
```

### 1.4 Git

**다운로드**: https://git-scm.com/download/win

```powershell
git --version
```

### 1.5 추가 도구 (선택)

- **VSCode**: https://code.visualstudio.com/
- **Windows Terminal**: Microsoft Store에서 설치

---

## 2. 개발 환경 구조

```
all-erp/
├── dev-environment/              # 개발 환경 설정
│   ├── docker-compose.infra.yml  # 인프라만 실행
│   ├── docker-compose.all.yml    # 전체 서비스 실행
│   ├── .env.example              # 환경 변수 템플릿
│   └── README.md                 # 본 가이드
├── apps/                         # 애플리케이션 코드
├── libs/                         # 공통 라이브러리
└── docs/                         # 문서
```

---

## 3. 환경 변수 설정

### 3.1 .env 파일 생성

```powershell
cd d:\all-erp\dev-environment
copy .env.example .env
```

### 3.2 .env 파일 편집

주요 변수만 수정하면 됩니다. 기본값으로도 충분합니다.

```bash
# PostgreSQL
POSTGRES_PASSWORD=devpassword123

# JWT
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars!!!

# Refresh Token
REFRESH_TOKEN_SECRET=dev-refresh-token-secret-min-32-chars!!!
```

---

## 4. 인프라 서비스 실행

### 4.1 인프라만 실행 (권장)

**가장 일반적인 개발 방식**: 인프라(DB, Redis, RabbitMQ 등)만 Docker로 실행하고, 애플리케이션은 로컬에서 `nx serve` 명령으로 실행합니다.

```powershell
cd d:\all-erp\dev-environment

# 인프라 서비스 시작
docker-compose -f docker-compose.infra.yml up -d

# 로그 확인
docker-compose -f docker-compose.infra.yml logs -f

# 상태 확인
docker-compose -f docker-compose.infra.yml ps
```

**실행되는 서비스**:
- PostgreSQL (Port: 5432)
- Redis (Port: 6379)
- RabbitMQ (Port: 5672, 15672)
- Milvus + etcd + MinIO (RAG용)

### 4.2 서비스 중지

```powershell
docker-compose -f docker-compose.infra.yml down
```

### 4.3 데이터 초기화 (주의!)

```powershell
# 볼륨 포함 전체 삭제
docker-compose -f docker-compose.infra.yml down -v
```

---

## 5. 애플리케이션 개발 모드

### 5.1 의존성 설치

```powershell
cd d:\all-erp
pnpm install
```

### 5.2 Prisma 설정

```powershell
# Prisma Client 생성
pnpm prisma generate

# 데이터베이스 마이그레이션
pnpm prisma migrate dev
```

### 5.3 서비스 실행 (예: auth-service)

```powershell
# 특정 서비스 실행
pnpm nx serve auth-service

# 브라우저에서 접속
# http://localhost:3001
# http://localhost:3001/api/docs (Swagger)
```

### 5.4 여러 서비스 동시 실행

```powershell
# 두 개 이상의 터미널에서 각각 실행
pnpm nx serve auth-service
pnpm nx serve system-service
pnpm nx serve web-admin
```

---

## 6. 전체 서비스 Docker 실행 (선택)

**통합 테스트** 또는 **전체 시스템 실행**이 필요한 경우:

```powershell
cd d:\all-erp\dev-environment

# 모든 서비스 실행 (시간이 오래 걸림)
docker-compose -f docker-compose.all.yml up -d

# Frontend 접속
# http://localhost:4200
```

---

## 7. hosts 파일 설정 (선택)

도메인으로 접근하려면 `hosts` 파일을 수정해야 합니다.

### 7.1 hosts 파일 위치

```
C:\Windows\System32\drivers\etc\hosts
```

### 7.2 관리자 권한으로 메모장 열기

```powershell
# PowerShell을 관리자 권한으로 실행 후
notepad C:\Windows\System32\drivers\etc\hosts
```

### 7.3 추가할 내용

```
127.0.0.1 all-erp.local
127.0.0.1 app.all-erp.local
127.0.0.1 api.all-erp.local
127.0.0.1 gitlab.all-erp.local
127.0.0.1 registry.all-erp.local
127.0.0.1 monitor.all-erp.local
```

---

## 8. 트러블슈팅

### 8.1 Docker Desktop이 시작되지 않음

**해결책**:
1. WSL 2 설치 확인
   ```powershell
   wsl --install
   ```
2. BIOS에서 가상화(Virtualization) 활성화
3. Docker Desktop 재설치

### 8.2 포트 충돌

**증상**: `Bind for 0.0.0.0:5432 failed: port is already allocated`

**해결책**:
```powershell
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :5432

# 프로세스 종료
taskkill /PID <PID> /F
```

### 8.3 Docker 컨테이너가 느림

**해결책**:
1. Docker Desktop > Settings > Resources에서 CPU/메모리 증가
2. WSL 2 메모리 제한 설정

   **파일 생성**: `C:\Users\<Username>\.wslconfig`
   ```ini
   [wsl2]
   memory=8GB
   processors=4
   ```

3. WSL 재시작
   ```powershell
   wsl --shutdown
   ```

### 8.4 Prisma 마이그레이션 실패

**해결책**:
```powershell
# PostgreSQL 컨테이너 재시작
docker-compose -f docker-compose.infra.yml restart postgres

# 마이그레이션 재실행
pnpm prisma migrate dev --name init
```

### 8.5 pnpm install 오류

**해결책**:
```powershell
# 캐시 클리어
pnpm store prune

# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
pnpm install
```

---

## 9. 유용한 명령어 모음

### Docker Compose

```powershell
# 서비스 목록 확인
docker-compose -f docker-compose.infra.yml ps

# 로그 보기 (실시간)
docker-compose -f docker-compose.infra.yml logs -f postgres

# 특정 서비스 재시작
docker-compose -f docker-compose.infra.yml restart redis

# 컨테이너 내부 접속
docker exec -it erp-postgres psql -U postgres -d erp
```

### Nx

```powershell
# 의존성 그래프 확인
pnpm nx graph

# 특정 서비스 빌드
pnpm nx build auth-service

# 테스트
pnpm nx test auth-service

# 린트
pnpm nx lint auth-service
```

---

## 10. 개발 워크플로우 예시

**Day 1: 환경 설정**
```powershell
# 1. 인프라 실행
cd d:\all-erp\dev-environment
docker-compose -f docker-compose.infra.yml up -d

# 2. 의존성 설치
cd d:\all-erp
pnpm install

# 3. DB 마이그레이션
pnpm prisma migrate dev
```

**Day 2+: 개발**
```powershell
# 터미널 1: Backend 실행
pnpm nx serve auth-service

# 터미널 2: Frontend 실행
pnpm nx serve web-admin
```

**퇴근 시**
```powershell
# 인프라 종료 (선택)
docker-compose -f docker-compose.infra.yml down
```

---

## 11. 리소스 사용량

**최소 요구사항 (인프라만)**:
- CPU: 4 Core
- RAM: 8 GB
- Disk: 50 GB

**권장 사양 (개발 + 인프라)**:
- CPU: 8 Core
- RAM: 16 GB
- Disk: 100 GB SSD

---

## 12. 다음 단계

- [ ] [코딩 컨벤션](../docs/human/coding_convention.md) 숙지
- [ ] [API 설계 가이드](../docs/human/api_design_guide.md) 확인
- [ ] [DB 설계 가이드](../docs/human/db_design_guide.md) 확인
- [ ] Phase 1 PRD 읽고 개발 시작
