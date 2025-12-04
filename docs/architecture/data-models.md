# All-ERP 데이터 모델 개요

> **작성일**: 2025-12-04  
> **버전**: v2.0 (Database per Service)

## 📋 개요

All-ERP v2.0에서는 **Database per Service** 패턴을 채택하여 각 마이크로서비스가 독립된 데이터베이스를 사용합니다.

- **PostgreSQL**: 16개 독립 데이터베이스 (단일 컨테이너)
- **MongoDB**: 1개 데이터베이스 (ai-service 전용)

---

## 🗄️ 데이터베이스 구성

### PostgreSQL 컨테이너 (all-erp-postgres:5432)

| 서비스 | 데이터베이스명 | 주요 테이블 |
|--------|----------------|-------------|
| auth-service | auth_db | users, roles, permissions, user_roles, refresh_tokens |
| system-service | system_db | common_codes, code_groups, system_settings |
| tenant-service | tenant_db | tenants, tenant_settings, subscriptions |
| personnel-service | personnel_db | employees, departments, positions, employee_history |
| payroll-service | payroll_db | payrolls, salary_items, deductions, payroll_history |
| attendance-service | attendance_db | attendances, leaves, overtime, attendance_rules |
| budget-service | budget_db | budgets, budget_items, budget_allocations |
| accounting-service | accounting_db | accounts, journals, ledgers, transactions |
| settlement-service | settlement_db | settlements, settlement_items, closing_entries |
| asset-service | asset_db | assets, asset_depreciation, asset_transfers |
| supply-service | supply_db | supplies, inventory, requisitions, stock_movements |
| general-affairs-service | general_affairs_db | facilities, vehicles, maintenance, reservations |
| approval-service | approval_db | approval_flows, approval_requests, approval_history |
| report-service | report_db | reports, report_templates, report_schedules |
| notification-service | notification_db | notifications, notification_templates, subscriptions |
| file-service | file_db | files, file_metadata, file_versions |

### MongoDB 컨테이너 (all-erp-mongo:27017)

| 서비스 | 데이터베이스명 | 주요 컬렉션 |
|--------|----------------|-------------|
| ai-service | ai_db | documents, embeddings, ocr_results, chat_history |

---

## 📊 서비스별 상세 데이터 모델

### 1. auth-service (auth_db)

**인증 및 인가 담당**

```sql
-- 사용자
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 역할
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 권한
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자-역할 매핑
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Token
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. personnel-service (personnel_db)

**인사 정보 관리**

```sql
-- 직원
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  hire_date DATE NOT NULL,
  department_id INTEGER,
  position_id INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 부서
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER,
  manager_id INTEGER,
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 직급
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  level INTEGER,
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인사 이동 이력
CREATE TABLE employee_history (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  event_type VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. payroll-service (payroll_db)

**급여 관리**

```sql
-- 급여
CREATE TABLE payrolls (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  payment_month VARCHAR(7) NOT NULL,  -- YYYY-MM
  base_salary DECIMAL(15, 2) NOT NULL,
  total_allowance DECIMAL(15, 2) DEFAULT 0,
  total_deduction DECIMAL(15, 2) DEFAULT 0,
  net_pay DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  tenant_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 급여 항목
CREATE TABLE salary_items (
  id SERIAL PRIMARY KEY,
  payroll_id INTEGER REFERENCES payrolls(id),
  item_type VARCHAR(50) NOT NULL,  -- allowance, deduction
  item_code VARCHAR(50) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. ai-service (ai_db - MongoDB)

**AI 및 ML 기능**

```javascript
// 문서 임베딩
{
  "_id": ObjectId("..."),
  "tenantId": 1,
  "documentId": "DOC-123",
  "content": "급여 명세서 조회 방법은...",
  "embedding": [0.123, 0.456, ...],  // 1536차원 벡터
  "metadata": {
    "category": "급여",
    "source": "매뉴얼",
    "language": "ko"
  },
  "createdAt": ISODate("2025-12-04T12:00:00Z"),
  "updatedAt": ISODate("2025-12-04T12:00:00Z")
}

// OCR 결과
{
  "_id": ObjectId("..."),
  "tenantId": 1,
  "receiptId": "RCP-456",
  "imageUrl": "s3://receipts/456.jpg",
  "ocrResult": {
    "vendor": "스타벅스",
    "amount": 15000,
    "date": "2025-12-04",
    "items": [
      { "name": "아메리카노", "price": 4500 }
    ]
  },
  "confidence": 0.95,
  "processedAt": ISODate("2025-12-04T12:00:00Z")
}

// 챗봇 대화 이력
{
  "_id": ObjectId("..."),
  "tenantId": 1,
  "userId": 123,
  "sessionId": "session-789",
  "messages": [
    {
      "role": "user",
      "content": "급여 명세서 조회 방법은?",
      "timestamp": ISODate("2025-12-04T12:00:00Z")
    },
    {
      "role": "assistant",
      "content": "인사 > 급여 메뉴에서...",
      "timestamp": ISODate("2025-12-04T12:00:01Z")
    }
  ],
  "createdAt": ISODate("2025-12-04T12:00:00Z")
}
```

---

## 🔑 공통 설계 원칙

### 1. 공통 컬럼

모든 PostgreSQL 테이블에 포함:

```sql
id SERIAL PRIMARY KEY,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP  -- Soft Delete
```

### 2. 멀티테넌시

대부분의 데이터 테이블에 포함:

```sql
tenant_id INTEGER NOT NULL
```

### 3. 네이밍 규칙

- **테이블명**: Snake Case, 복수형 (예: `users`, `payroll_items`)
- **컬럼명**: Snake Case (예: `employee_id`, `created_at`)
- **Boolean**: `is_` 또는 `has_` 접두사 (예: `is_active`)
- **날짜/시간**: `_at` 접미사 (예: `created_at`)

### 4. 데이터 타입

- **금액**: `DECIMAL(15, 2)` (정확한 소수점)
- **날짜**: `DATE`
- **시간**: `TIMESTAMP` 또는 `TIMESTAMPTZ`
- **문자열**: `VARCHAR(길이)` 또는 `TEXT`

---

## 🔄 서비스 간 데이터 공유

### 직접 DB 접근 금지

다른 서비스의 데이터가 필요한 경우:

1. **API 호출 (동기)**
   ```typescript
   // payroll-service에서 직원 정보 조회
   const employee = await personnelClient.getEmployee(empId);
   ```

2. **이벤트 구독 (비동기)**
   ```typescript
   // personnel-service: 직원 정보 변경 시
   eventBus.publish('employee.updated', { id, name, deptId });
   
   // payroll-service: 이벤트 수신하여 캐시 업데이트
   @EventPattern('employee.updated')
   handleEmployeeUpdated(data) {
     cache.set(`employee:${data.id}`, data);
   }
   ```

---

## 📚 참고 문서

- [DB 설계 가이드](../human/db_design_guide.md)
- [마이크로서비스 아키텍처](./microservices-architecture-review.md)
- [Database per Service 가이드](./database-per-service-guide.md)

---

**문서 버전**: 1.0  
**작성일**: 2025-12-04  
**작성자**: All-ERP Architecture Team
