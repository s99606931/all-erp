# TASK-P2-01: System 도메인 DB 연결 - 결과 보고서

## 📋 작업 요약

**작업 기간**: 2025-12-05  
**담당자**: AI Assistant  
**상태**: ✅ 완료

## 🎯 작업 목표

System 도메인(auth, system, tenant 서비스)의 DB 연결을 신규 독립 DB로 전환하여 Database per Service 패턴 구현

## ✅ 완료된 작업

### 1. 환경 변수 설정

`.env.example` 파일에 17개 마이크로서비스별 독립 DATABASE_URL 추가:

```bash
# System 도메인
AUTH_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/auth_db?schema=public"
SYSTEM_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/system_db?schema=public"
TENANT_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/tenant_db?schema=public"

# HR 도메인
PERSONNEL_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/personnel_db?schema=public"
PAYROLL_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/payroll_db?schema=public"
ATTENDANCE_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/attendance_db?schema=public"

# Finance 도메인
BUDGET_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/budget_db?schema=public"
ACCOUNTING_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/accounting_db?schema=public"
SETTLEMENT_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/settlement_db?schema=public"

# Operations 도메인
ASSET_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/asset_db?schema=public"
SUPPLY_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/supply_db?schema=public"
GENERAL_AFFAIRS_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/general_affairs_db?schema=public"

# Platform 도메인
APPROVAL_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/approval_db?schema=public"
REPORT_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/report_db?schema=public"
NOTIFICATION_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/notification_db?schema=public"
FILE_DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/file_db?schema=public"
```

### 2. Prisma 7 설정 파일 생성

각 서비스별로 독립적인 `prisma.config.ts` 파일 생성:

**apps/system/auth-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('AUTH_DATABASE_URL'),
  },
});
```

**apps/system/system-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('SYSTEM_DATABASE_URL'),
  },
});
```

**apps/system/tenant-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('TENANT_DATABASE_URL'),
  },
});
```

### 3. Prisma 스키마 수정 (Prisma 7 호환성)

Prisma 7에서는 `schema.prisma`에서 `url`을 제거하고 `prisma.config.ts`에서만 관리:

**변경 전**:
```prisma
datasource db {
    provider = "postgresql"
    url      = env("AUTH_DATABASE_URL")
}
```

**변경 후**:
```prisma
datasource db {
    provider = "postgresql"
}
```

### 4. Prisma 마이그레이션 실행

각 서비스별로 독립 데이터베이스에 마이그레이션 실행:

```bash
# auth-service
cd apps/system/auth-service
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/system/auth-service/prisma.config.ts

# system-service
cd apps/system/system-service
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/system/system-service/prisma.config.ts

# tenant-service
cd apps/system/tenant-service
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/system/tenant-service/prisma.config.ts
```

**마이그레이션 결과**:

✅ **auth_db** (auth-service):
- users
- refresh_tokens
- processed_events
- outbox_events
- _prisma_migrations

✅ **system_db** (system-service):
- common_codes
- departments
- system_settings
- processed_events
- outbox_events
- _prisma_migrations

✅ **tenant_db** (tenant-service):
- tenants
- tenant_settings
- processed_events
- outbox_events
- _prisma_migrations

### 5. Prisma Client 생성

각 서비스별로 Prisma Client 생성:

```bash
cd apps/system/auth-service && pnpm prisma generate --config=/data/all-erp/apps/system/auth-service/prisma.config.ts
cd apps/system/system-service && pnpm prisma generate --config=/data/all-erp/apps/system/system-service/prisma.config.ts
cd apps/system/tenant-service && pnpm prisma generate --config=/data/all-erp/apps/system/tenant-service/prisma.config.ts
```

## 📊 아키텍처 다이어그램

```mermaid
graph TB
    subgraph "System 도메인 서비스"
        direction TB
        AUTH["auth-service<br/>(Port: 3001)"]
        SYSTEM["system-service<br/>(Port: 3002)"]
        TENANT["tenant-service<br/>(Port: 3006)"]
    end
    
    subgraph "PostgreSQL 컨테이너"
        direction TB
        AUTH_DB["auth_db<br/>(users, refresh_tokens)"]
        SYSTEM_DB["system_db<br/>(common_codes, departments)"]
        TENANT_DB["tenant_db<br/>(tenants, tenant_settings)"]
    end
    
    AUTH -->|독립 연결| AUTH_DB
    SYSTEM -->|독립 연결| SYSTEM_DB
    TENANT -->|독립 연결| TENANT_DB
    
    style AUTH fill:#4169E1,stroke:#000,stroke-width:2px,color:#fff
    style SYSTEM fill:#32CD32,stroke:#000,stroke-width:2px,color:#fff
    style TENANT fill:#FF6347,stroke:#000,stroke-width:2px,color:#fff
    style AUTH_DB fill:#87CEEB,stroke:#000,stroke-width:2px
    style SYSTEM_DB fill:#90EE90,stroke:#000,stroke-width:2px
    style TENANT_DB fill:#FFA07A,stroke:#000,stroke-width:2px
```

## 🎓 Why This Matters (초급자를 위한 설명)

### 1. Database per Service 패턴이란?

**전통적인 모놀리식 아키텍처**:
```mermaid
graph LR
    A["모든 서비스"] --> B["단일 데이터베이스<br/>(all_erp)"]
    
    style B fill:#FF6B6B,stroke:#000,stroke-width:2px,color:#fff
```

**문제점**:
- ❌ 한 서비스의 DB 변경이 다른 서비스에 영향
- ❌ 데이터베이스가 병목 지점이 됨
- ❌ 서비스 독립 배포 불가능
- ❌ 스키마 변경 시 모든 서비스 영향

**Database per Service 패턴**:
```mermaid
graph TB
    A["auth-service"] --> A_DB["auth_db"]
    B["system-service"] --> B_DB["system_db"]
    C["tenant-service"] --> C_DB["tenant_db"]
    
    style A fill:#4169E1,stroke:#000,stroke-width:2px,color:#fff
    style B fill:#32CD32,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#FF6347,stroke:#000,stroke-width:2px,color:#fff
```

**장점**:
- ✅ **서비스 독립성**: 각 서비스가 자신의 DB를 완전히 소유
- ✅ **독립 배포**: DB 스키마 변경이 다른 서비스에 영향 없음
- ✅ **기술 선택의 자유**: 필요시 다른 DB 기술 선택 가능
- ✅ **확장성**: 특정 서비스의 DB만 독립적으로 스케일링
- ✅ **장애 격리**: 한 DB 장애가 다른 서비스에 영향 없음

### 2. Prisma 7의 새로운 설정 방식

**Prisma 6 이하** (기존 방식):
```prisma
// schema.prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")  // ❌ 스키마에 URL 정의
}
```

**Prisma 7** (새로운 방식):
```prisma
// schema.prisma
datasource db {
    provider = "postgresql"  // ✅ URL 제거
}
```

```typescript
// prisma.config.ts
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('AUTH_DATABASE_URL'),  // ✅ 설정 파일에서 URL 관리
  },
});
```

**왜 이렇게 변경되었나?**
- ✅ **보안**: 민감한 연결 정보를 코드와 분리
- ✅ **유연성**: 환경별로 다른 설정 파일 사용 가능
- ✅ **타입 안정성**: TypeScript로 설정 검증

### 3. 서비스 간 데이터 공유는 어떻게?

**잘못된 방법** ❌:
```typescript
// system-service에서 auth_db에 직접 접근
const user = await authDb.user.findUnique({ ... });  // ❌ 금지!
```

**올바른 방법** ✅:

**방법 1: API 호출**
```typescript
// system-service
const response = await fetch('http://auth-service:3001/api/users/123');
const user = await response.json();
```

**방법 2: 이벤트 발행/구독**
```typescript
// auth-service (이벤트 발행)
await eventBus.publish('user.created', { userId: '123', email: 'user@example.com' });

// system-service (이벤트 구독)
eventBus.subscribe('user.created', async (event) => {
  // 로컬 DB에 필요한 정보만 저장
  await db.userCache.create({ userId: event.userId, email: event.email });
});
```

### 4. Outbox 패턴이란?

각 서비스의 스키마에 `outbox_events` 테이블이 있습니다:

```prisma
model OutboxEvent {
    id        String   @id @default(uuid())
    eventId   String   @unique
    eventType String
    payload   String   // JSON
    status    String   @default("PENDING")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

**Outbox 패턴의 동작 방식**:

```mermaid
sequenceDiagram
    participant Service as auth-service
    participant DB as auth_db
    participant Worker as Outbox Worker
    participant MQ as RabbitMQ
    
    Service->>DB: 1. 비즈니스 데이터 저장
    Service->>DB: 2. Outbox 이벤트 저장 (같은 트랜잭션)
    Worker->>DB: 3. PENDING 이벤트 조회
    Worker->>MQ: 4. 이벤트 발행
    Worker->>DB: 5. 상태를 PUBLISHED로 변경
```

**왜 Outbox 패턴을 사용하나?**
- ✅ **트랜잭션 보장**: DB 저장과 이벤트 발행이 원자적으로 처리
- ✅ **신뢰성**: 이벤트 유실 방지
- ✅ **재시도**: 실패 시 자동 재시도 가능

## 🚨 발견된 이슈 및 해결

### 이슈 1: Prisma 7 설정 파일 우선순위

**문제**: 각 서비스 디렉토리에서 명령 실행 시 루트의 `prisma.config.ts`를 로드

**원인**: Prisma 7은 프로젝트 루트에서 설정 파일을 먼저 찾음

**해결**:
```bash
# --config 옵션으로 명시적으로 지정
pnpm prisma migrate dev --config=/data/all-erp/apps/system/auth-service/prisma.config.ts
```

### 이슈 2: Prisma 7 스키마 파일에서 url 제거

**문제**: `schema.prisma`에 `url = env("DATABASE_URL")`이 있으면 에러 발생

**에러 메시지**:
```
Error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
```

**해결**: 모든 서비스의 `schema.prisma`에서 `url` 라인 제거

### 이슈 3: 환경 변수 선택적 처리

**문제**: 루트 `prisma.config.ts`에서 `env('SERVICE_NAME')` 사용 시 필수 환경 변수 에러

**해결**: `process.env.SERVICE_NAME`으로 변경하여 선택적으로 처리

## 📈 데이터베이스 검증 결과

### auth_db 테이블 확인

```sql
postgres=# \c auth_db
auth_db=# \dt

               List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | _prisma_migrations | table | postgres
 public | outbox_events      | table | postgres
 public | processed_events   | table | postgres
 public | refresh_tokens     | table | postgres
 public | users              | table | postgres
(5 rows)
```

### system_db 테이블 확인

```sql
postgres=# \c system_db
system_db=# \dt

               List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | _prisma_migrations | table | postgres
 public | common_codes       | table | postgres
 public | departments        | table | postgres
 public | outbox_events      | table | postgres
 public | processed_events   | table | postgres
 public | system_settings    | table | postgres
(6 rows)
```

### tenant_db 테이블 확인

```sql
postgres=# \c tenant_db
tenant_db=# \dt

               List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | _prisma_migrations | table | postgres
 public | outbox_events      | table | postgres
 public | processed_events   | table | postgres
 public | tenant_settings    | table | postgres
 public | tenants            | table | postgres
(5 rows)
```

## 🔧 유용한 명령어

### Prisma 마이그레이션

```bash
# auth-service 마이그레이션
cd apps/system/auth-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/system/auth-service/prisma.config.ts

# system-service 마이그레이션
cd apps/system/system-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/system/system-service/prisma.config.ts

# tenant-service 마이그레이션
cd apps/system/tenant-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/system/tenant-service/prisma.config.ts
```

### Prisma Client 생성

```bash
# auth-service
cd apps/system/auth-service && pnpm prisma generate --config=/data/all-erp/apps/system/auth-service/prisma.config.ts

# system-service
cd apps/system/system-service && pnpm prisma generate --config=/data/all-erp/apps/system/system-service/prisma.config.ts

# tenant-service
cd apps/system/tenant-service && pnpm prisma generate --config=/data/all-erp/apps/system/tenant-service/prisma.config.ts
```

### 데이터베이스 확인

```bash
# auth_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d auth_db -c "\dt"

# system_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d system_db -c "\dt"

# tenant_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d tenant_db -c "\dt"

# 특정 테이블 스키마 확인
docker exec all-erp-postgres psql -U postgres -d auth_db -c "\d users"
```

### 서비스 실행

```bash
# 개별 서비스 실행
pnpm nx serve auth-service
pnpm nx serve system-service
pnpm nx serve tenant-service

# Swagger 문서 확인
# http://localhost:3001/api/docs (auth-service)
# http://localhost:3002/api/docs (system-service)
# http://localhost:3006/api/docs (tenant-service)
```

## ✅ 완료 체크리스트

- [x] `.env.example`에 17개 서비스별 DATABASE_URL 추가
- [x] auth-service `prisma.config.ts` 생성
- [x] system-service `prisma.config.ts` 생성
- [x] tenant-service `prisma.config.ts` 생성
- [x] 각 서비스 `schema.prisma`에서 `url` 제거 (Prisma 7 호환)
- [x] auth-service Prisma 마이그레이션 성공
- [x] system-service Prisma 마이그레이션 성공
- [x] tenant-service Prisma 마이그레이션 성공
- [x] auth-service Prisma Client 생성 성공
- [x] system-service Prisma Client 생성 성공
- [x] tenant-service Prisma Client 생성 성공
- [x] auth_db 테이블 생성 확인 (5개 테이블)
- [x] system_db 테이블 생성 확인 (6개 테이블)
- [x] tenant_db 테이블 생성 확인 (5개 테이블)

## 🎯 다음 단계

1. **TASK-P2-02**: HR 도메인 DB 연결 (personnel, payroll, attendance)
2. **TASK-P2-03**: Finance 도메인 DB 연결 (budget, accounting, settlement)
3. **TASK-P2-04**: Operations 도메인 DB 연결 (asset, supply, general-affairs)
4. **TASK-P2-05**: Platform 도메인 DB 연결 (approval, report, notification, file)

## 📚 참고 문서

- [Prisma 7 Configuration](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#datasource)
- [Database per Service Pattern](https://microservices.io/patterns/data/database-per-service.html)
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)

## 🔐 보안 고려사항

### 운영 환경 배포 시 주의사항

1. **환경 변수 관리**
   - `.env` 파일을 Git에 커밋하지 말 것
   - Kubernetes Secrets 또는 AWS Secrets Manager 사용
   - 각 환경별로 다른 비밀번호 사용

2. **데이터베이스 접근 제어**
   - 서비스별로 독립적인 DB 사용자 생성
   - 최소 권한 원칙 적용
   - 네트워크 레벨에서 접근 제어

3. **감사 로그**
   - 모든 DB 변경 사항 로깅
   - 민감한 데이터 접근 추적

---

**작성일**: 2025-12-05  
**작성자**: AI Assistant  
**버전**: 1.0
