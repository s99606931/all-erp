# DB 설계 가이드 (Database Design Guide)

본 문서는 ALL-ERP 시스템의 데이터베이스 네이밍 규칙, 인덱싱 전략, 마이그레이션 절차를 정의합니다.

## 1. 네이밍 규칙

### 1.1 테이블명

- **Snake Case 사용**: `user_profiles` (not `UserProfiles`)
- **복수형 사용**: `users` (not `user`)
- **명사 사용**: `orders` (not `ordering`)

**예시**:
```sql
users
user_profiles
personnel_records
payroll_entries
budget_items
```

### 1.2 컬럼명

- **Snake Case 사용**: `first_name`, `created_at`
- **Boolean**: `is_` 또는 `has_` 접두사 (`is_active`, `has_permissions`)
- **날짜/시간**: `_at` 접미사 (`created_at`, `updated_at`)

**예시**:
```sql
id
email
first_name
last_name
is_active
created_at
updated_at
deleted_at  -- Soft Delete
```

### 1.3 외래키

- **형식**: `{관계테이블}_id`

**예시**:
```sql
user_id
tenant_id
department_id
```

### 1.4 인덱스명

- **형식**: `idx_{테이블명}_{컬럼명}`

**예시**:
```sql
idx_users_email
idx_users_tenant_id
idx_payroll_entries_employee_id
```

### 1.5 제약조건

- **Primary Key**: `pk_{테이블명}`
- **Foreign Key**: `fk_{테이블명}_{관계테이블}`
- **Unique**: `uq_{테이블명}_{컬럼명}`

---

## 2. 공통 컬럼

모든 테이블에 다음 컬럼을 포함해야 합니다:

```sql
id SERIAL PRIMARY KEY,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP  -- Soft Delete용
```

**멀티테넌시 테이블**:
```sql
tenant_id INTEGER NOT NULL REFERENCES tenants(id)
```

---

## 3. 데이터 타입

### 3.1 문자열

| 용도 | 타입 | 예시 |
|------|------|------|
| 짧은 문자열 | `VARCHAR(100)` | 이름, 이메일 |
| 긴 문자열 | `VARCHAR(500)` | 주소 |
| 본문 | `TEXT` | 설명, 댓글 |
| 고정 길이 | `CHAR(10)` | 코드 (잘 사용 안 함) |

### 3.2 숫자

| 용도 | 타입 | 예시 |
|------|------|------|
| ID, 일반 정수 | `INTEGER` | 사용자 ID |
| 큰 정수 | `BIGINT` | 거래 ID |
| **금액, 급여** | `DECIMAL(15, 2)` | ⚠️ 정확한 소수점 필요 |
| 퍼센티지 | `DECIMAL(5, 2)` | 99.99% |

> **중요**: 금액 계산은 **절대 FLOAT/DOUBLE 사용 금지!** DECIMAL 사용 필수

### 3.3 날짜/시간

| 용도 | 타입 |
|------|------|
| 날짜 | `DATE` |
| 시간 | `TIME` |
| 날짜+시간 | `TIMESTAMP` (권장) |
| 타임존 포함 | `TIMESTAMPTZ` |

### 3.4 Boolean

```sql
is_active BOOLEAN DEFAULT TRUE
```

---

## 4. 인덱싱 전략

### 4.1 인덱스 생성 기준

**반드시 인덱스를 생성해야 하는 경우**:
- Primary Key (자동 생성)
- Foreign Key
- WHERE 절에 자주 사용되는 컬럼
- ORDER BY에 사용되는 컬럼
- Unique 제약이 필요한 컬럼

**예시**:
```sql
-- Foreign Key 인덱스
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- 검색용 복합 인덱스
CREATE INDEX idx_personnel_records_tenant_status ON personnel_records(tenant_id, status);

-- Unique 인덱스
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### 4.2 복합 인덱스 순서

- **선택도가 높은 컬럼을 앞에** (카디널리티가 높은 컬럼)
- **자주 사용하는 조건을 앞에**

**예시**:
```sql
-- 좋은 예
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
-- WHERE status = 'pending' AND created_at > '2025-01-01'

-- 나쁜 예
CREATE INDEX idx_orders_created_status ON orders(created_at, status);
```

### 4.3 인덱스 모니터링

```sql
-- PostgreSQL: 인덱스 사용 통계
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;  -- 사용되지 않는 인덱스
```

---

## 5. Prisma 스키마 예시

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  isActive  Boolean  @default(true) @map("is_active")
  tenantId  Int      @map("tenant_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  
  @@index([tenantId])
  @@index([email])
  @@map("users")
}
```

---

## 6. 마이그레이션 절차

### 6.1 Prisma Migrate

**개발 환경**:
```bash
# 마이그레이션 파일 생성 및 적용
pnpm prisma migrate dev --name add_user_table

# Prisma Client 재생성
pnpm prisma generate
```

**운영 환경**:
```bash
# 마이그레이션만 적용 (DB 리셋 없음)
pnpm prisma migrate deploy
```

### 6.2 마이그레이션 네이밍

- **형식**: `YYYYMMDDHHMMSS_description`
- **예시**: `20250115120000_add_user_table`

### 6.3 마이그레이션 롤백

Prisma는 기본적으로 롤백을 지원하지 않으므로, **수동 롤백 SQL** 작성 필요:

```sql
-- migrations/20250115_add_user_table_rollback.sql
DROP TABLE users;
```

---

## 7. 멀티테넌시 전략

### 7.1 Schema per Tenant

각 테넌트는 별도의 스키마를 사용합니다.

```sql
-- 테넌트 A
CREATE SCHEMA tenant_a;
CREATE TABLE tenant_a.users (...);

-- 테넌트 B
CREATE SCHEMA tenant_b;
CREATE TABLE tenant_b.users (...);
```

**Prisma 동적 스키마 전환**:
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://user:pass@localhost:5432/erp?schema=tenant_${tenantId}`,
    },
  },
});
```

### 7.2 Row Level Security (대안)

단일 스키마에서 `tenant_id`로 데이터 격리:

```sql
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant')::INTEGER);
```

---

## 8. 성능 최적화

### 8.1 N+1 문제 해결

**Prisma Include 사용**:
```typescript
const users = await prisma.user.findMany({
  include: {
    profile: true,  // 한 번의 쿼리로 조인
  },
});
```

### 8.2 Batch 처리

```typescript
// 한 번에 여러 레코드 생성
await prisma.user.createMany({
  data: [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
  ],
});
```

### 8.3 Connection Pool

```
DATABASE_URL="postgresql://user:pass@localhost:5432/erp?connection_limit=10"
```

---

## 9. 데이터 무결성

### 9.1 Foreign Key Constraint

```sql
ALTER TABLE users
ADD CONSTRAINT fk_users_tenant
FOREIGN KEY (tenant_id) REFERENCES tenants(id)
ON DELETE CASCADE;  -- 또는 RESTRICT
```

### 9.2 Check Constraint

```sql
ALTER TABLE budget_items
ADD CONSTRAINT check_amount_positive
CHECK (amount > 0);
```

---

## 10. Soft Delete

일반 삭제 대신 `deleted_at` 컬럼 사용:

```typescript
// Soft Delete
await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() },
});

// 조회 시 필터링
await prisma.user.findMany({
  where: { deletedAt: null },
});
```

---

## 11. DB 설계 체크리스트

- [ ] 모든 테이블에 `created_at`, `updated_at` 포함
- [ ] Foreign Key에 인덱스 생성
- [ ] 금액 컬럼은 DECIMAL 사용
- [ ] Unique 제약이 필요한 컬럼 확인
- [ ] 멀티테넌시 적용 (tenant_id)
- [ ] Soft Delete 컬럼 추가 (필요 시)
