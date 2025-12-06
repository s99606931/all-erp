# AI 학습 가이드 (AI Learning Guide)

> **목적**: AI가 프로젝트에 투입되어 작업을 시작하기 전에 필수 컨텍스트를 빠르게 습득할 수 있도록 안내합니다.

## 📋 학습 순서 (Learning Path)

작업 시작 전 다음 순서로 문서를 학습하세요:

### 1단계: 필수 학습 (작업 전 반드시 읽을 것)

1. ✅ **본 문서** (`docs/ai/README.md`): 프로젝트 개요 및 학습 가이드
2. 📝 [`vibe_coding.md`](./vibe_coding.md): AI 페르소나, 코딩 스타일, 답변 규칙
3. 🏗️ [`project_context.md`](./project_context.md): 아키텍처, 기술 스택, 핵심 개념
4. 📋 [`task_workflow.md`](./task_workflow.md): PRD 기반 작업 진행 방법

### 2단계: 작업별 참조 문서 (필요시 참조)

- 📐 [`../human/coding_convention.md`](../human/coding_convention.md): 상세 코딩 컨벤션
- 🗺️ [`../project_roadmap.md`](../project_roadmap.md): 전체 로드맵 및 단계별 목표
- 🎯 **작업할 PRD 문서**: `docs/tasks/phaseN-xxx/X.Y_task_name.md`

---

## 🎯 프로젝트 개요

### 프로젝트명

**ALL-ERP** - 차세대 MSA 기반 SaaS ERP 시스템

### 핵심 특징

- **아키텍처**: Microservices Architecture (MSA)
- **배포 모델**: Multi-tenant SaaS (고객사별 데이터 격리)
- **차별점**: AI 기반 업무 자동화 (OCR 자동 분개, RAG 챗봇, 이상 탐지)

### 기술 스택 (2025년 12월 v2.0)

- **Backend**: NestJS 11.x, Prisma 7.x, PostgreSQL 17 (17개 DB)
- **Frontend**: Vite + React 19, Module Federation (11개 앱)
- **Infrastructure**: Docker, pnpm, Nx Monorepo
- **Architecture**: Database per Service + Micro Frontend
- **AI**: ai-service (MongoDB), LangChain, OpenAI GPT-4o
- **Management**: `./erp` Unified Script

### ⚠️ 핵심 규칙 (Critical Rules)

1. **한국어 주석**: 모든 코드(클래스, 메서드)에 한국어 주석 필수.
2. **Database per Service**: 타 서비스 DB 직접 접근 절대 금지.
3. **Docker First**: 모든 실행은 `./erp start` 또는 `docker compose` 기반.

---

## 📂 프로젝트 구조

```
all-erp/
├── apps/                     # 마이크로서비스 (17개)
│   ├── system/              # auth, system, tenant-service
│   ├── hr/                  # personnel, payroll, attendance
│   ├── finance/             # budget, accounting, settlement
│   ├── general/             # asset, supply, general-affairs
│   ├── ai/                  # ai-service (MongoDB)
│   ├── platform/            # approval, report, notification, file (신규)
│   └── frontend/            # Micro Frontend (11개 앱)
│       ├── shell/           # Host 앱
│       ├── system-mfe/      # Remote 앱 (시스템관리)
│       ├── hr-mfe/          # Remote 앱 (인사)
│       └── ... (10개 Remote)
├── libs/
│   ├── shared/
│   │   ├── util/, domain/, infra/
│   │   └── database/        # Prisma 스키마 (17개)
│   └── frontend/            # 프론트엔드 공통 라이브러리
├── docs/
│   ├── ai/                 # ✨ AI 전용 가이드
│   ├── architecture/        # 아키텍처 문서
│   ├── README-MICROSERVICES-PLAN.md
│   └── ...
└── dev-environment/          # Docker Compose (인프라, 서비스)
```

---

## 🚀 작업 시작 방법

### Step 1: 학습 완료 확인

- [ ] `vibe_coding.md` 읽고 AI 페르소나 숙지
- [ ] `project_context.md` 읽고 아키텍처 이해
- [ ] `task_workflow.md` 읽고 작업 프로세스 숙지

### Step 2: 작업 PRD 확인

사용자가 지정한 PRD 문서를 읽고 다음을 파악:

- **목표**: 무엇을 만들어야 하는가?
- **요구사항**: 어떤 기능이 필요한가?
- **기술적 의사결정**: 어떤 선택지가 있고, 권장사항은 무엇인가?
- **작업 단위**: 구체적으로 어떤 명령어를 실행해야 하는가?

### Step 3: 작업 진행

`task_workflow.md`에 정의된 프로세스를 따라 진행:

1. PRD 내용 확인
2. 코드 생성
3. 테스트
4. 문서화

---

## ⚠️ 주의사항

### 필수 준수 사항

- ✅ **모든 주석은 한국어로 작성**
- ✅ **pnpm nx 명령어 사용** (npm/yarn 금지)
- ✅ **바이브 코딩 페르소나 유지** (시니어 개발자, 주도적, 간결)
- ✅ **타입 안전성 확보** (`any` 사용 최소화)
- ✅ **PRD의 기술적 의사결정 준수** (권장사항 우선 적용)

### 금지 사항

- ❌ 전체 문서를 무작정 읽지 말 것 (필요한 문서만 선택적으로 참조)
- ❌ PRD 없이 임의로 구현하지 말 것
- ❌ 사용자에게 확인 없이 기술 스택 변경 금지

---

## 📞 도움이 필요하면?

- **코딩 스타일 궁금**: [`vibe_coding.md`](./vibe_coding.md)
- **아키텍처 이해 필요**: [`project_context.md`](./project_context.md)
- **작업 방법 모르겠음**: [`task_workflow.md`](./task_workflow.md)
- **사람 개발자 컨벤션**: [`../human/coding_convention.md`](../human/coding_convention.md)
