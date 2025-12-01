# 프로젝트 컨텍스트 (Project Context)

> AI가 코드 작성 전 이해해야 할 **아키텍처, 기술 스택, 핵심 개념**을 정리한 문서입니다.

## 1. 아키텍처 개요

### 1.1 MSA (Microservices Architecture)
본 프로젝트는 **기능별로 독립된 서비스**로 분리된 마이크로서비스 아키텍처를 따릅니다.

#### 서비스 도메인 분류
- **System Domain**: 인증(`auth-service`), 시스템관리(`system-service`), 테넌트관리(`tenant-service`)
- **HR Domain**: 인사(`personnel-service`), 급여(`payroll-service`), 복무(`attendance-service`)
- **Finance Domain**: 예산(`budget-service`), 재무(`accounting-service`), 결산(`settlement-service`)
- **General Domain**: 자산(`asset-service`), 물품(`supply-service`), 총무(`general-affairs-service`)
- **AI Domain**: AI 서비스(`ai-service`)
- **Frontend**: 통합 관리자 웹(`web-admin`)

### 1.2 Multi-tenancy (멀티테넌시)
SaaS 서비스로서 **하나의 인스턴스에서 다수의 고객사를 지원**합니다.

- **데이터 격리 방식**: **Schema per Tenant** (PostgreSQL 스키마 분리)
- **테넌트 식별**: Subdomain(`tenantA.erp.com`) + Header(`X-Tenant-ID`)
- **구현**: 모든 요청에 `tenantId`를 포함하여 Prisma 쿼리 시 자동으로 해당 스키마 참조

---

## 2. 기술 스택 상세

### 2.1 Backend (NestJS)
- **버전**: NestJS 최신 (Node.js 22 LTS)
- **ORM**: Prisma (타입 안전, 마이그레이션 관리)
- **인증**: `@nestjs/passport` + `passport-jwt`
- **유효성 검사**: `class-validator` + `class-transformer`
- **로깅**: `winston` (JSON 포맷)

### 2.2 Frontend (Next.js)
- **버전**: Next.js 15 (App Router 사용)
- **UI 라이브러리**: Shadcn/UI (Tailwind CSS 기반)
- **상태 관리**: Zustand (전역) + TanStack Query (서버 상태)
- **폼 관리**: React Hook Form + Zod

### 2.3 Database
- **RDBMS**: PostgreSQL (각 서비스별 독립 DB, 테넌트별 스키마 분리)
- **Cache**: Redis (세션, 공통 코드 캐싱)
- **Message Queue**: RabbitMQ (서비스 간 이벤트 전파)

### 2.4 Infrastructure
- **모노레포**: Nx (빌드 최적화, 의존성 그래프)
- **패키지 매니저**: pnpm (디스크 공간 절약, 빠른 설치)
- **컨테이너**: Docker (Multi-stage build)
- **오케스트레이션**: Kubernetes + Helm

---

## 3. 핵심 개념

### 3.1 Nx Monorepo 구조
- **Apps**: 실행 가능한 애플리케이션 (`apps/` 하위)
- **Libs**: 재사용 가능한 라이브러리 (`libs/shared/` 하위)
- **Path Alias**: `@all-erp/shared/util` 형태로 임포트

### 3.2 Prisma 사용 규칙
- **멀티테넌시 적용**: 모든 쿼리는 `tenantId` 필터 자동 적용 (Middleware)
- **마이그레이션**: `pnpm prisma migrate dev` (개발), `pnpm prisma migrate deploy` (운영)
- **타입 생성**: `pnpm prisma generate` 실행으로 TypeScript 타입 자동 생성

### 3.3 서비스 간 통신
- **동기 통신**: HTTP REST API (NestJS `HttpService`)
- **비동기 통신**: RabbitMQ 이벤트 (`@nestjs/microservices`)
- **예시**: 회원가입 시 `UserCreated` 이벤트 발행 → `system-service`가 초기 데이터 생성

### 3.4 인증/인가 흐름
1. 사용자가 `/api/auth/login` 호출
2. `auth-service`가 JWT Access Token + Refresh Token 발급
3. 클라이언트는 `Authorization: Bearer <token>` 헤더로 요청
4. 각 서비스의 `JwtAuthGuard`가 토큰 검증 및 `req.user` 주입
5. `RolesGuard`가 사용자 역할에 따라 접근 제어

---

## 4. 폴더 및 파일 네이밍 규칙

### 4.1 NestJS (Backend)
- **모듈**: `user.module.ts`, `auth.module.ts`
- **컨트롤러**: `user.controller.ts`
- **서비스**: `user.service.ts`
- **DTO**: `create-user.dto.ts`, `update-user.dto.ts`
- **Entity**: `user.entity.ts` (Prisma를 사용하므로 거의 사용 안 함)

### 4.2 Next.js (Frontend)
- **App Router**: `app/dashboard/page.tsx`, `app/login/layout.tsx`
- **컴포넌트**: `components/ui/button.tsx` (Shadcn), `components/layout/sidebar.tsx`
- **Hooks**: `hooks/use-auth.ts`, `hooks/use-tenant.ts`
- **Stores**: `stores/user-store.ts` (Zustand)

---

## 5. 환경 변수 관리

- **파일 위치**: 루트의 `.env` (Git 무시), `.env.example` (템플릿)
- **로드 방식**: `@nestjs/config` (NestJS), `process.env` (Next.js)
- **필수 변수 검증**: Joi/Zod 스키마로 앱 시작 시 검증

### 주요 환경 변수
```
DATABASE_URL=postgresql://user:pass@localhost:5432/erp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

---

## 6. 개발 워크플로우

### 6.1 로컬 개발
```bash
# 인프라만 실행 (DB, Redis, RabbitMQ)
docker-compose -f docker-compose.infra.yml up -d

# 특정 서비스 실행
pnpm nx serve auth-service

# 프론트엔드 실행
pnpm nx serve web-admin
```

### 6.2 테스트
```bash
# 단위 테스트
pnpm nx test auth-service

# E2E 테스트
pnpm nx e2e web-admin-e2e
```

---

## 7. 참조 문서

- **사람 개발자용**: [`docs/human/coding_convention.md`](../human/coding_convention.md)
- **전체 로드맵**: [`docs/project_roadmap.md`](../project_roadmap.md)
- **PRD 템플릿**: `docs/tasks/phaseN-xxx/` 하위 파일들
