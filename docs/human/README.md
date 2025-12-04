# 개발자 온보딩 가이드

> **환영합니다!** 이 문서는 ALL-ERP 프로젝트에 새롭게 합류한 개발자, 엔지니어, DBA를 위한 온보딩 가이드입니다.

## 📋 학습 순서 (Onboarding Path)

프로젝트에 투입되기 전, 다음 순서로 문서를 학습하세요:

### 필수 학습 (1~2일 소요 예상)
1. ✅ **본 문서** (`docs/human/README.md`): 온보딩 개요 및 개발 환경 설정
2. 📐 [`coding_convention.md`](./coding_convention.md): 코딩 컨벤션 및 폴더 구조
3. 🤝 [`collaboration_guide.md`](./collaboration_guide.md): AI와의 협업 방법
4. 🛠️ [`development_guide.md`](./development_guide.md): 로컬 개발 및 디버깅 가이드
5. 🗺️ [`../project_roadmap.md`](../project_roadmap.md): 전체 로드맵 및 현재 진행 상황

### 역할별 추가 학습
- **Backend 개발자**: NestJS, Prisma, Multi-tenancy 개념
- **Frontend 개발자**: Next.js 15, Shadcn/UI, TanStack Query
- **DevOps 엔지니어**: Docker, Kubernetes, CI/CD 파이프라인
- **DBA**: PostgreSQL 스키마 분리, Prisma 마이그레이션

---

## 🎯 프로젝트 개요

### 프로젝트명
**ALL-ERP** - 차세대 MSA 기반 SaaS ERP 시스템

### 비전
공공기관 및 기업을 위한 AI 기반 지능형 ERP 플랫폼을 구축하여, 업무 효율성을 200% 향상시키고 운영 비용을 30% 절감합니다.

### 핵심 특징
- **MSA**: 17개의 독립적인 마이크로서비스 (Database per Service)
- **SaaS**: 멀티테넌트 아키텍처 (Row-Level Security 기반 데이터 격리)
- **Micro Frontend**: Module Federation 기반 11개 프론트엔드 앱
- **AI Integration**: 자동 분개, RAG 챗봇, 이상 탐지

### 기술 스택
```
Backend:  NestJS, Prisma ORM, PostgreSQL (17 DBs), Redis, RabbitMQ
Frontend: Vite, React, Module Federation, TanStack Query, Zustand
DevOps:   Docker Compose, Kubernetes, pnpm, Nx Monorepo
AI:       LangChain, OpenAI GPT-4o, Pinecone/Qdrant
Storage:  Minio (S3-compatible)
```

---

## 🚀 개발 환경 설정

### 1. 필수 소프트웨어 설치

#### 1.1 Node.js (v22 LTS)
```bash
# Node.js 22 설치 (LTS)
# Windows: https://nodejs.org/
# Mac: brew install node@22
node -v  # v22.x.x 확인
```

#### 1.2 pnpm (패키지 매니저)
```bash
npm install -g pnpm
pnpm -v  # 9.x.x 이상
```

#### 1.3 Docker Desktop
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Docker Compose가 포함되어 있어야 함

#### 1.4 Git
```bash
git --version  # 2.x 이상
```

### 2. 프로젝트 클론 및 설치

```bash
# 저장소 클론
git clone <repository-url> all-erp
cd all-erp

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 필수 값들을 채워넣으세요
```

### 3. 로컬 개발 환경 실행

#### 3.1 인프라 실행 (17개 DB, Redis, RabbitMQ, Minio)
```bash
cd dev-environment
docker compose -f docker-compose.infra.yml up -d

# 로그 확인
docker compose -f docker-compose.infra.yml logs -f
```

#### 3.2 백엔드 서비스 실행 (17개)
```bash
# Docker Compose로 특정 서비스 실행
cd dev-environment
docker compose -f docker-compose.dev.yml up -d auth-service

# 또는 로컬에서 직접 실행
pnpm nx serve auth-service

# 여러 서비스 동시 실행
docker compose -f docker-compose.dev.yml up -d auth-service system-service tenant-service
```

#### 3.3 프론트엔드 실행 (Micro Frontend)
```bash
# Shell + Remote 앱 모두 실행
cd dev-environment
docker compose -f docker-compose.frontend.yml up -d

# 또는 Shell 앱만 실행
pnpm nx serve shell
# http://localhost:3000 접속
```

### 4. 개발 도구 설정

#### 4.1 VSCode Extensions (권장)
- **ESLint**: 코드 스타일 검사
- **Prettier**: 자동 포맷팅
- **Prisma**: Prisma 스키마 하이라이팅
- **GitLens**: Git 히스토리 시각화

#### 4.2 VSCode 설정 (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 📂 프로젝트 구조 이해

```
all-erp/
├── apps/                    # 마이크로서비스 앱들 (17개)
│   ├── system/             # 인증, 시스템, 테넌트 관리 (3개)
│   ├── hr/                 # 인사, 급여, 복무 (3개)
│   ├── finance/            # 예산, 재무, 결산 (3개)
│   ├── general/            # 자산, 물품, 총무 (3개)
│   ├── platform/           # 결재, 보고서, 알림, 파일 (4개)
│   ├── ai/                 # AI 서비스 (1개)
│   └── frontend/           # Micro Frontend (11개)
│       ├── shell/         # Shell 앱 (1개)
│       └── remote/        # Remote 앱 (10개)
├── libs/shared/            # 공통 라이브러리
│   ├── util/              # 유틸리티
│   ├── domain/            # DTO, Exception
│   ├── infra/             # DB, MQ, Storage 모듈
│   └── ui/                # UI 컴포넌트
├── docs/                   # 문서
│   ├── human/             # 👥 사람 개발자용 (현재 위치)
│   ├── ai/                # 🤖 AI용
│   ├── architecture/      # 아키텍처 문서
│   └── tasks/             # 📋 PRD 문서
├── dev-environment/        # Docker Compose 설정
└── deploy/                 # 배포 설정
```

---

## 👥 팀 협업 규칙

### 1. Git 브랜치 전략
- `main`: 운영 배포용 (보호됨)
- `develop`: 개발 통합 브랜치
- `feature/TASK-ID-description`: 기능 개발 브랜치
- `hotfix/ISSUE-ID-description`: 긴급 수정 브랜치

### 2. Commit 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경

예시: feat(auth): JWT 리프레시 토큰 로직 추가
```

### 3. Pull Request 프로세스
1. 기능 브랜치에서 개발 완료
2. `develop` 브랜치로 PR 생성
3. 최소 1명 이상의 코드 리뷰 승인 필요
4. CI 테스트 통과 확인
5. Merge (Squash & Merge 권장)

---

## 🆘 자주 묻는 질문 (FAQ)

### Q1. 서비스가 실행되지 않아요
A: 
1. Docker 인프라가 실행 중인지 확인: `docker ps`
2. 환경 변수가 설정되어 있는지 확인: `.env` 파일
3. 포트 충돌 확인: 다른 프로세스가 포트를 사용 중인지 확인

### Q2. Prisma 마이그레이션 오류가 발생해요
A:
```bash
# DB 초기화 (개발 환경에서만!)
pnpm prisma migrate reset

# 마이그레이션 재실행
pnpm prisma migrate dev
```

### Q3. AI와 협업은 어떻게 하나요?
A: [`collaboration_guide.md`](./collaboration_guide.md)를 참조하세요. PRD를 작성하면 AI가 코드를 생성해줍니다.

### Q4. 테스트는 어떻게 실행하나요?
A:
```bash
# 단위 테스트
pnpm nx test auth-service

# E2E 테스트
pnpm nx e2e web-admin-e2e

# 전체 테스트
pnpm nx run-many --target=test --all
```

---

## 📞 도움 받기

### 기술적 질문
- **Slack**: #dev-all-erp 채널
- **이슈 트래커**: GitHub Issues

### 문서 피드백
- **문서 개선 제안**: PR로 직접 수정하거나 이슈 등록

---

## ✅ 온보딩 체크리스트

개발 시작 전 다음을 확인하세요:

- [ ] 필수 소프트웨어 설치 완료 (Node.js, pnpm, Docker)
- [ ] 저장소 클론 및 의존성 설치 완료
- [ ] `.env` 파일 설정 완료
- [ ] 로컬 환경에서 서비스 실행 성공
- [ ] `coding_convention.md` 읽고 규칙 숙지
- [ ] `collaboration_guide.md` 읽고 협업 프로세스 이해
- [ ] Git 브랜치 전략 및 커밋 규칙 숙지
- [ ] 팀 Slack 채널 가입

**축하합니다! 🎉 이제 개발을 시작할 준비가 되었습니다.**
