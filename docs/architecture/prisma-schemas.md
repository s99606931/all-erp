# Prisma 스키마 구조 문서

> **작성일**: 2025-12-04  
> **버전**: v2.0 (Database per Service)

## 📋 개요

All-ERP v2.0에서는 **Database per Service** 패턴에 따라 각 마이크로서비스가 독립적인 Prisma 스키마를 가집니다.

- **PostgreSQL**: 16개 서비스 (각각 독립 스키마)
- **MongoDB**: 1개 서비스 (ai-service, Prisma 미사용)

---

## 🗂️ 서비스별 Prisma 스키마 위치

### System Domain (6개)

| 서비스 | 스키마 위치 | 주요 모델 |
|--------|-------------|-----------|
| auth-service | `apps/system/auth-service/prisma/schema.prisma` | User, RefreshToken, ProcessedEvent, OutboxEvent |
| system-service | `apps/system/system-service/prisma/schema.prisma` | CommonCode, Department, SystemSetting |
| tenant-service | `apps/system/tenant-service/prisma/schema.prisma` | Ten ant, TenantSetting |
| approval-service | `apps/system/approval-service/prisma/schema.prisma` | ApprovalRequest, ApprovalLine |
| report-service | `apps/system/report-service/prisma/schema.prisma` | Report (CQRS Read Model) |
| notification-service | `apps/system/notification-service/prisma/schema.prisma` | Notification |
| file-service | `apps/system/file-service/prisma/schema.prisma` | File |

### HR Domain (3개)

| 서비스 | 스키마 위치 | 주요 모델 |
|--------|-------------|-----------|
| personnel-service | `apps/hr/personnel-service/prisma/schema.prisma` | Employee, EmployeeHistory |
| payroll-service | `apps/hr/payroll-service/prisma/schema.prisma` | Payroll, PayrollItem |
| attendance-service | `apps/hr/attendance-service/prisma/schema.prisma` | Attendance, LeaveRequest |

### Finance Domain (3개)

| 서비스 | 스키마 위치 | 주요 모델 |
|--------|-------------|-----------|
| budget-service | `apps/finance/budget-service/prisma/schema.prisma` | Budget |
| accounting-service | `apps/finance/accounting-service/prisma/schema.prisma` | ChartOfAccounts, JournalEntry, JournalEntryLine |
| settlement-service | `apps/finance/settlement-service/prisma/schema.prisma` | Settlement |

### General Domain (3개)

| 서비스 | 스키마 위치 | 주요 모델 |
|--------|-------------|-----------|
| asset-service | `apps/general/asset-service/prisma/schema.prisma` | Asset, AssetHistory |
| supply-service | `apps/general/supply-service/prisma/schema.prisma` | Inventory, InventoryTransaction |
| general-affairs-service | `apps/general/general-affairs-service/prisma/schema.prisma` | Vehicle, VehicleReservation |

### AI Domain (1개)

| 서비스 | DB | 비고 |
|--------|-----|------|
| ai-service | MongoDB (ai_db) | Prisma 미사용, Mongoose 또는 MongoDB Native Driver 사용 |

---

## 📐 공통 설계 원칙

### 1. Datasource 설정

모든 PostgreSQL 스키마는 다음 datasource를 사용합니다:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**환경 변수 예시**:
```bash
# auth-service .env
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/auth_db"

# personnel-service .env
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/personnel_db"
```

### 2. Generator 설정

모든 서비스는 독립적인 Prisma Client를 생성합니다:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}
```

### 3. 공통 모델

모든 서비스에 다음 공통 모델이 포함됩니다:

#### ProcessedEvent (이벤트 멱등성 관리)
```prisma
model ProcessedEvent {
  eventId     String   @id @map("event_id")
  eventType   String   @map("event_type")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([eventType])
  @@map("processed_events")
}
```

**목적**: 동일한 이벤트가 중복 처리되지 않도록 방지

#### OutboxEvent (Outbox 패턴)
```prisma
model OutboxEvent {
  id        String   @id @default(uuid())
  eventId   String   @unique @map("event_id")
  eventType String   @map("event_type")
  payload   String   // JSON
  status    String   @default("PENDING")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@map("outbox_events")
}
```

**목적**: 트랜잭션과 이벤트 발행의 원자성 보장

### 4. 외래키 제거 규칙

Database per Service에서는 **다른 서비스의 테이블을 외래키로 참조하지 않습니다**.

#### ❌ 잘못된 예 (외래키 참조)
```prisma
model Employee {
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])  // 금지!
}
```

#### ✅ 올바른 예 (ID만 저장)
```prisma
model Employee {
  userId String @map("user_id")  // auth-service API로 조회
  // user 관계 없음
}
```

### 5. 네이밍 규칙

- **테이블명**: `@@map` 사용, Snake Case (예: `"users"`, `"payroll_items"`)
- **컬럼명**: `@map` 사용, Snake Case (예: `"created_at"`, `"user_id"`)
- **모델명**: PascalCase (예: `User`, `PayrollItem`)
- **필드명**: camelCase (예: `createdAt`, `userId`)

---

## 🔄 서비스 간 데이터 참조

### 1. API 호출 (동기)

```typescript
// payroll-service에서 직원 정보 필요 시
const employee = await this.httpService.get(
  `http://personnel-service:3011/api/employees/${employeeId}`
).toPromise();
```

### 2. 이벤트 구독 (비동기)

```typescript
// personnel-service: 직원 정보 변경 시
await this.eventBus.publish('employee.updated', {
  employeeId,
  name,
  departmentId,
});

// payroll-service: 이벤트 수신
@RabbitSubscribe('employee.updated')
async handleEmployeeUpdated(data) {
  // 로컬 캐시 업데이트
  await this.cache.set(`employee:${data.employeeId}`, data);
}
```

---

## 🚀 Prisma Client 생성

각 서비스별로 Prisma Client를 독립적으로 생성해야 합니다:

```bash
# auth-service
cd apps/system/auth-service
pnpm prisma generate

# personnel-service
cd apps/hr/personnel-service
pnpm prisma generate

# payroll-service
cd apps/hr/payroll-service
pnpm prisma generate

# ... 모든 서비스에 대해 반복
```

**일괄 생성 스크립트** (예정):
```bash
./scripts/prisma-generate-all.sh
```

---

## 📊 스키마 통계

| 항목 | 수량 |
|------|------|
| 총 Prisma 스키마 파일 | 16개 |
| PostgreSQL 서비스 | 16개 |
| MongoDB 서비스 | 1개 (Prisma 미사용) |
| 공통 모델 | 2개 (ProcessedEvent, OutboxEvent) |
| 총 비즈니스 모델 | 약 25개 |

---

## 📚 참고 문서

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Database per Service 가이드](./database-per-service-guide.md)
- [데이터 모델 문서](./data-models.md)

---

**문서 버전**: 1.0  
**작성일**: 2025-12-04  
**작성자**: All-ERP Architecture Team
