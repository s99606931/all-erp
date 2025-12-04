# 프로젝트 컨텍스트 (Project Context)

> AI가 코드 작성 전 이해해야 할 **아키텍처, 기술 스택, 핵심 개념**을 정리한 문서입니다.

## 1. 아키텍처 개요

### 1.1 MSA (Microservices Architecture) v2.0

본 프로젝트는 **완전한 독립성을 가진 마이크로서비스** 아키텍처를 따릅니다.

#### 아키텍처 원칙
- **Database per Service**: 각 서비스는 전용 DB를 가짐 (17개 DB 인스턴스)
- **서비스 독립성**: 서비스 간 직접 DB 참조 금지
- **이벤트 기반 통신**: RabbitMQ를 통한 느슨한 결합
- **Micro Frontend**: Module Federation 기반 프론트엔드 분리

#### 서비스 구성 (총 17개)

**현재 서비스 (13개 유지)**
- **System Domain** (3개): 
  - `auth-service` (3001, PostgreSQL)
  - `system-service` (3002, PostgreSQL)
  - `tenant-service` (3006, PostgreSQL)
- **HR Domain** (3개):
  - `personnel-service` (3011, PostgreSQL)
  - `payroll-service` (3012, PostgreSQL)
  - `attendance-service` (3013, PostgreSQL)
- **Finance Domain** (3개):
  - `budget-service` (3021, PostgreSQL)
  - `accounting-service` (3022, PostgreSQL)
  - `settlement-service` (3023, PostgreSQL)
- **General Domain** (3개):
  - `asset-service` (3031, PostgreSQL)
  - `supply-service` (3032, PostgreSQL)
  - `general-affairs-service` (3033, PostgreSQL)
- **AI Domain** (1개):
  - `ai-service` (3007, MongoDB)

**신규 서비스 (4개 추가)**
- **Platform Services** (4개):
  - `approval-service` (3050, PostgreSQL) - 전자결재
  - `report-service` (3060, PostgreSQL) - 통합 보고서 (CQRS)
  - `notification-service` (3070, PostgreSQL) - 알림
  - `file-service` (3080, PostgreSQL) - 파일 관리

### 1.2 Multi-tenancy (멀티테넌시)
SaaS 서비스로서 **하나의 인스턴스에서 다수의 고객사를 지원**합니다.

- **데이터 격리 방식**: **Row-Level Security (RLS)** (각 테이블의 tenantId 필드)
- **테넌트 식별**: Subdomain(`tenantA.erp.com`) + Header(`X-Tenant-ID`)
- **구현**: 모든 DB 쿼리에 tenantId 필터 자동 적용

---

## 2. 기술 스택 상세

### 2.1 Backend (NestJS)
- **버전**: NestJS 11.x (Node.js 22 LTS)
- **ORM**: Prisma 7.x (서비스별 독립 스키마)
- **인증**: `@nestjs/passport` + `passport-jwt`
- **유효성 검사**: `class-validator` + `class-transformer`
- **로깅**: `winston` (JSON 포맷)

### 2.2 Frontend (Vite + React + Module Federation)
- **Shell 앱**: Vite + React 19 (Host)
- **Remote 앱**: 10개 독립 앱 (도메인별)
- **UI 라이브러리**: Shadcn/UI (Tailwind CSS v4)
- **상태 관리**: Zustand (전역) + TanStack Query (서버 상태)
- **폼 관리**: React Hook Form + Zod

### 2.3 Database (17개 인스턴스)
- **PostgreSQL** (16개): 서비스별 독립 DB
  - auth_db, system_db, tenant_db
  - personnel_db, payroll_db, attendance_db
  - budget_db, accounting_db, settlement_db
  - asset_db, supply_db, general_affairs_db
  - approval_db, report_db, notification_db, file_db
- **MongoDB** (1개): ai_db (AI 서비스 전용)
- **Cache**: Redis (세션, 공통 데이터 캐싱)
- **Message Queue**: RabbitMQ (서비스 간 이벤트)

### 2.4 Infrastructure
- **모노레포**: Nx 22.x (빌드 최적화, 의존성 그래프)
- **패키지 매니저**: pnpm 10.x
- **컨테이너**: Docker (Multi-stage build)
- **Module Federation**: Webpack Module Federation Plugin

---

## 3. 핵심 개념

### 3.1 Database per Service 패턴

**원칙**:
- 각 서비스는 자신의 DB만 접근
- 다른 서비스의 DB에 직접 쿼리 금지
- Foreign Key 대신 ID만 저장

**서비스 간 데이터 공유 방법**:

1. **API 호출**
```typescript
// payroll-service에서 직원 정보 필요 시
const employee = await this.httpService.get(
  `http://personnel-service:3011/api/employees/${empId}`
).toPromise();
```

2. **이벤트 기반 동기화**
```typescript
// personnel-service: 직원 정보 변경 시
await this.eventBus.publish('employee.updated', { id, name, deptId });

// payroll-service: 이벤트 구독하여 로컬 캐시 업데이트
@RabbitSubscribe('employee.updated')
async handleEmployeeUpdated(data) {
  await this.cache.set(`employee:${data.id}`, data);
}
```

### 3.2 Prisma 사용 규칙

**서비스별 독립 스키마**:
```
libs/shared/database/
├── auth/prisma/schema.prisma
├── personnel/prisma/schema.prisma
├── payroll/prisma/schema.prisma
└── ... (17개)
```

**마이그레이션**:
```bash
# 서비스별 독립 마이그레이션
cd libs/shared/database/auth
pnpm prisma migrate dev --name init

# 전체 일괄 마이그레이션
./scripts/migrate-all.sh
```

### 3.3 Micro Frontend 구조

**Module Federation**:
- **Shell 앱** (localhost:4200): Host 앱, 레이아웃 제공
- **Remote 앱** (각 포트): 도메인별 독립 앱
  - system-mfe (4201)
  - hr-mfe (4202)
  - payroll-mfe (4203)
  - ... (총 10개)

**공유 라이브러리**:
```typescript
// Shell 앱 webpack 설정
remotes: {
  systemMfe: 'systemMfe@http://localhost:4201/remoteEntry.js',
  hrMfe: 'hrMfe@http://localhost:4202/remoteEntry.js',
  // ...
},
shared: {
  react: { singleton: true },
  'react-router-dom': { singleton: true },
}
```

### 3.4 인증/인가 흐름
1. 사용자가 `/api/auth/login` 호출
2. `auth-service`가 `auth_db`에서 사용자 검증
3. JWT Access Token + Refresh Token 발급
4. 클라이언트는 `Authorization: Bearer <token>` 헤더로 요청
5. 각 서비스의 `JwtAuthGuard`가 토큰 검증
6. `RolesGuard`가 권한 검증

---

## 4. 폴더 및 파일 네이밍 규칙

### 4.1 NestJS (Backend)
- **모듈**: `user.module.ts`
- **컨트롤러**: `user.controller.ts`
- **서비스**: `user.service.ts`
- **DTO**: `create-user.dto.ts`

### 4.2 Vite + React (Frontend)
- **Shell 앱**: `apps/frontend/shell/src/App.tsx`
- **Remote 앱**: `apps/frontend/system-mfe/src/pages/CommonCodePage.tsx`
- **컴포넌트**: `components/ui/button.tsx`
- **Hooks**: `hooks/use-auth.ts`
- **Stores**: `stores/auth-store.ts`

---

## 5. 환경 변수 관리

### 백엔드 (예: auth-service)
```bash
# auth-service .env
DB_HOST=postgres-auth        # 독립 DB 인스턴스
DB_PORT=5432
DB_DATABASE=auth_db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=your-secret-key
```

### 프론트엔드 (Vite)
```bash
# .env
VITE_API_GATEWAY=http://localhost/api
VITE_SYSTEM_MFE=http://localhost:4201
VITE_HR_MFE=http://localhost:4202
```

---

## 6. 개발 워크플로우

### 6.1 로컬 개발

```bash
# 1. 인프라 실행 (17개 DB + Redis + RabbitMQ)
docker compose -f docker-compose.infra.yml up -d

# 2. 백엔드 서비스 실행
pnpm nx serve auth-service    # 또는 Docker로

# 3. 프론트엔드 실행
pnpm nx serve shell           # Shell 앱
pnpm nx serve system-mfe      # Remote 앱
```

### 6.2 테스트
```bash
# 단위 테스트
pnpm nx test auth-service

# E2E 테스트
pnpm nx e2e auth-service-e2e
```

---

## 7. 참조 문서

- **마이크로서비스 전환 계획**: [`docs/README-MICROSERVICES-PLAN.md`](../README-MICROSERVICES-PLAN.md)
- **아키텍처 검토**: [`docs/architecture/microservices-architecture-review.md`](../architecture/microservices-architecture-review.md)
- **사람 개발자용**: [`docs/human/coding_convention.md`](../human/coding_convention.md)

---

**문서 버전**: 2.0  
**최종 업데이트**: 2025-12-04
