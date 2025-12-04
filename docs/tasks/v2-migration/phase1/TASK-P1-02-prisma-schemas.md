# TASK-P1-02: Prisma 스키마 분리

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P1-01 (DB 인스턴스 생성)

## 🎯 목표

현재 단일 `schema.prisma` 파일을 17개 서비스별로 분리하고, 각 서비스가 독립적인 Prisma 스키마를 가지도록 합니다.

## 📝 상세 작업 내용

### 1. 현재 스키마 분석

기존 `libs/shared/infra/src/lib/prisma/schema.prisma` 파일의 모델들을 분석하여 서비스별로 그룹화합니다.

**예시**:
```prisma
// 현재: 모든 모델이 하나의 파일에 있음
model User { ... }
model Employee { ... }
model Payroll { ... }
model Budget { ... }
```

### 2. 서비스별 Prisma 스키마 파일 생성

각 서비스 디렉토리에 독립적인 `schema.prisma` 생성:

**auth-service** (`apps/system/auth-service/prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/client"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  isActive  Boolean  @default(true) @map("is_active")
  tenantId  Int      @map("tenant_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  roles     UserRole[]

  @@index([tenantId])
  @@index([email])
  @@map("users")
}

model Role {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  users       UserRole[]

  @@unique([name, tenantId])
  @@map("roles")
}

model UserRole {
  userId    Int  @map("user_id")
  roleId    Int  @map("role_id")
  tenantId  Int  @map("tenant_id")

  user      User @relation(fields: [userId], references: [id])
  role      Role @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
  @@map("user_roles")
}

model ProcessedEvent {
  eventId     String   @id @map("event_id")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("processed_events")
}
```

**personnel-service** (`apps/hr/personnel-service/prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/client"
}

model Employee {
  id             Int      @id @default(autoincrement())
  userId         Int      @map("user_id")  // auth-service의 User ID (외래키 아님!)
  employeeNumber String   @unique @map("employee_number")
  name           String
  departmentId   Int      @map("department_id")
  positionId     Int      @map("position_id")
  hireDate       DateTime @map("hire_date")
  tenantId       Int      @map("tenant_id")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  department     Department @relation(fields: [departmentId], references: [id])
  position       Position   @relation(fields: [positionId], references: [id])

  @@index([tenantId])
  @@index([userId])
  @@map("employees")
}

model Department {
  id          Int      @id @default(autoincrement())
  name        String
  code        String   @unique
  parentId    Int?     @map("parent_id")
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  employees   Employee[]
  parent      Department?  @relation("DepartmentHierarchy", fields: [parentId], references: [id])
  children    Department[] @relation("DepartmentHierarchy")

  @@map("departments")
}

model Position {
  id          Int      @id @default(autoincrement())
  name        String
  level       Int
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  employees   Employee[]

  @@map("positions")
}

// 멱등성을 위한 이벤트 처리 기록
model ProcessedEvent {
  eventId     String   @id @map("event_id")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("processed_events")
}
```

### 3. 서비스별 환경 변수 설정

각 서비스의 `.env` 파일:

**auth-service .env**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db"
```

**personnel-service .env**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5435/personnel_db"
```

### 4. 외래키 제거 규칙

Database per Service에서는 **다른 서비스의 데이터를 외래키로 참조하지 않습니다**.

```prisma
// ❌ 잘못된 예: auth-service의 User를 외래키로 참조
model Employee {
  userId Int @map("user_id")
  user   User @relation(fields: [userId], references: [id])  // 금지!
}

// ✅ 올바른 예: userId만 저장 (외래키 없음)
model Employee {
  userId Int @map("user_id")  // auth-service API로 조회
  // user 관계 없음
}
```

### 5. 공통 모델 정의

모든 서비스에 필요한 공통 모델:

```prisma
// 이벤트 멱등성을 위한 테이블 (모든 서비스에 포함)
model ProcessedEvent {
  eventId     String   @id @map("event_id")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("processed_events")
}

// 필요시: Outbox 패턴용 테이블
model OutboxEvent {
  id        Int      @id @default(autoincrement())
  eventId   String   @unique @map("event_id")
  eventType String   @map("event_type")
  payload   String   // JSON
  status    String   // PENDING, PUBLISHED, FAILED
  createdAt DateTime @default(now()) @map("created_at")

  @@map("outbox_events")
}
```

## ✅ 완료 조건

- [ ] 17개 서비스 각각의 `prisma/schema.prisma` 파일 생성
- [ ] 각 스키마에서 다른 서비스 테이블 참조(외래키) 제거
- [ ] `ProcessedEvent` 모델을 모든 스키마에 추가
- [ ] 각 서비스의 `.env` 파일에 DATABASE_URL 설정
- [ ] Prisma Client 생성 확인: `pnpm prisma generate` (서비스별)
- [ ] 스키마 문서화 (`docs/architecture/prisma-schemas.md`)

## 🔧 실행 명령어

```bash
# 각 서비스별로 Prisma Client 생성
cd apps/system/auth-service
pnpm prisma generate

cd ../../hr/personnel-service
pnpm prisma generate

# ... 모든 서비스에 대해 반복
```

## 📚 참고 문서

- [Database per Service 가이드](file:///data/all-erp/docs/architecture/database-per-service-guide.md)
- [Prisma 공식 문서](https://www.prisma.io/docs)

## 🚨 주의사항

- **외래키 금지**: 다른 서비스 테이블을 외래키로 참조하지 않음
- **ID 참조**: userId 같은 필드는 단순 숫자로 저장, API로 조회
- **공통 모델**: ProcessedEvent는 모든 서비스에 필수
- **마이그레이션**: 기존 데이터 이관은 TASK-P1-03에서 처리
