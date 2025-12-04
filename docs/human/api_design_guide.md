# API 설계 가이드 (API Design Guide)

본 문서는 ALL-ERP 시스템의 RESTful API 설계 표준, 응답 포맷, 에러 코드 및 버전 관리 정책을 정의합니다.

## 1. RESTful API 설계 원칙

### 1.1 URL 네이밍 규칙

**리소스 중심 설계**:
```
GET    /api/v1/users           # 사용자 목록 조회
GET    /api/v1/users/:id       # 특정 사용자 조회
POST   /api/v1/users           # 사용자 생성
PUT    /api/v1/users/:id       # 사용자 전체 수정
PATCH  /api/v1/users/:id       # 사용자 일부 수정
DELETE /api/v1/users/:id       # 사용자 삭제
```

**네이밍 규칙**:
- 소문자 사용 (`/users`, not `/Users`)
- 복수형 사용 (`/users`, not `/user`)
- 하이픈 사용 (`/personnel-records`, not `/personnel_records`)
- 계층 구조: `/users/:userId/orders/:orderId`

### 1.2 HTTP 메서드

| 메서드 | 용도 | Idempotent |
|--------|------|-----------|
| `GET` | 조회 | ✅ |
| `POST` | 생성 | ❌ |
| `PUT` | 전체 수정 | ✅ |
| `PATCH` | 일부 수정 | ❌ |
| `DELETE` | 삭제 | ✅ |

---

## 2. 요청 및 응답 포맷

### 2.1 성공 응답 (2xx)

**단일 리소스**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

**리스트 (페이지네이션)**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "홍길동" },
    { "id": 2, "name": "김철수" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 2.2 에러 응답 (4xx, 5xx)

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다.",
    "statusCode": 404,
    "timestamp": "2025-01-15T10:30:00Z",
    "path": "/api/v1/users/999"
  }
}
```

---

## 3. 에러 코드 정의

### 3.1 표준 HTTP 상태 코드

| 코드 | 의미 | 사용 시나리오 |
|------|------|-------------|
| `200` | OK | 요청 성공 |
| `201` | Created | 리소스 생성 성공 |
| `204` | No Content | 삭제 성공 (응답 본문 없음) |
| `400` | Bad Request | 잘못된 요청 (유효성 검사 실패) |
| `401` | Unauthorized | 인증 실패 |
| `403` | Forbidden | 권한 없음 |
| `404` | Not Found | 리소스 없음 |
| `409` | Conflict | 중복 데이터 (이메일 중복 등) |
| `422` | Unprocessable Entity | 비즈니스 로직 검증 실패 |
| `500` | Internal Server Error | 서버 오류 |

### 3.2 커스텀 에러 코드

```typescript
export enum ErrorCode {
  // 인증/인가 (1xxx)
  INVALID_CREDENTIALS = 'AUTH_1001',
  TOKEN_EXPIRED = 'AUTH_1002',
  INSUFFICIENT_PERMISSION = 'AUTH_1003',

  // 사용자 관리 (2xxx)
  USER_NOT_FOUND = 'USER_2001',
  EMAIL_ALREADY_EXISTS = 'USER_2002',

  // 비즈니스 로직 (3xxx)
  BUDGET_EXCEEDED = 'BUDGET_3001',
  INVALID_ACCOUNTING_ENTRY = 'ACCOUNTING_3002',
}
```

---

## 4. 페이지네이션

### 4.1 Offset-based Pagination

**요청**:
```
GET /api/v1/users?page=1&limit=10
```

**응답**:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 4.2 Cursor-based Pagination (대량 데이터)

**요청**:
```
GET /api/v1/transactions?cursor=abc123&limit=50
```

**응답**:
```json
{
  "data": [...],
  "meta": {
    "nextCursor": "xyz789",
    "hasMore": true
  }
}
```

---

## 5. 필터링 및 정렬

### 5.1 필터링

```
GET /api/v1/users?filter[role]=admin&filter[status]=active
```

### 5.2 정렬

```
GET /api/v1/users?sort=-createdAt,name
# - (마이너스): 내림차순
# 콤마로 여러 필드 정렬 가능
```

### 5.3 검색

```
GET /api/v1/users?search=홍길동
```

---

## 6. API 버전 관리

### 6.1 URL 버전 관리 (권장)

```
/api/v1/users  # Version 1
/api/v2/users  # Version 2
```

### 6.2 Header 버전 관리

```http
GET /api/users HTTP/1.1
Accept: application/vnd.all-erp.v1+json
```

### 6.3 Deprecation 정책

- 신규 버전 출시 후 최소 6개월간 구 버전 유지
- Deprecation 경고 헤더 추가:
  ```http
  Deprecation: Sun, 01 Jan 2026 00:00:00 GMT
  ```

---

##  7. 인증 및 인가

### 7.1 Bearer Token

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.2 Tenant Identification

```http
X-Tenant-ID: customer-a
```

---

## 8. Rate Limiting

### 8.1 응답 헤더

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

### 8.2 제한 초과 시

**응답 (429 Too Many Requests)**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "요청 한도를 초과했습니다. 1분 후 다시 시도하세요.",
    "statusCode": 429
  }
}
```

---

## 9. 비동기 작업

대용량 처리 등 시간이 오래 걸리는 작업은 비동기로 처리합니다.

**요청**:
```
POST /api/v1/reports/generate
```

**응답 (202 Accepted)**:
```json
{
  "success": true,
  "data": {
    "jobId": "job-123",
    "status": "processing",
    "statusUrl": "/api/v1/jobs/job-123"
  }
}
```

**상태 확인**:
```
GET /api/v1/jobs/job-123
```

---

## 10. Swagger/OpenAPI 문서화

모든 API는 Swagger로 자동 문서화되어야 합니다.

**NestJS 예시**:
```typescript
@ApiTags('users')
@Controller('users')
export class UserController {
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [UserDto] })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Get()
  async findAll() {
    // ...
  }
}
```

**Swagger UI 접근**:
```
http://localhost:3001/api/docs
```

---

## 11. 서비스 간 통신 (Microservices Communication)

Database per Service 패턴에서는 다른 서비스의 DB에 직접 접근할 수 없습니다.

### 11.1 동기 통신 (HTTP API)

다른 서비스의 데이터가 필요할 때 HTTP API를 호출합니다.

**예시: 급여 서비스에서 인사 서비스 데이터 조회**
```typescript
// payroll-service
async calculatePayroll(employeeId: number) {
  // 인사 서비스 API 호출
  const employee = await this.httpService.get(
    `http://personnel-service:3011/api/v1/employees/${employeeId}`
  ).toPromise();
  
  // 급여 계산 로직
  const salary = this.calculateSalary(employee.data);
  return salary;
}
```

### 11.2 비동기 통신 (RabbitMQ Event)

데이터 변경을 다른 서비스에 알릴 때 이벤트를 발행합니다.

**예시: 사용자 생성 이벤트 발행**
```typescript
// auth-service
async createUser(dto: CreateUserDto) {
  const user = await this.prisma.user.create({ data: dto });
  
  // 이벤트 발행
  await this.eventBus.publish('user.created', {
    userId: user.id,
    email: user.email,
    tenantId: user.tenantId,
    timestamp: new Date(),
  });
  
  return user;
}
```

**이벤트 수신**
```typescript
// personnel-service
@EventPattern('user.created')
async handleUserCreated(data: UserCreatedEvent) {
  // 인사 기본 정보 생성
  await this.prisma.employee.create({
    data: {
      userId: data.userId,
      tenantId: data.tenantId,
    },
  });
}
```

### 11.3 통신 패턴 선택 기준

| 시나리오 | 권장 방법 |
|---------|----------|
| 즉시 응답 필요 | HTTP API (동기) |
| 데이터 일관성보다 성능 우선 | 이벤트 (비동기) |
| 여러 서비스에 알림 필요 | 이벤트 (비동기) |
| 트랜잭션 보장 필요 | Saga 패턴 (이벤트) |

---

## 12. 이벤트 페이로드 설계

### 12.1 이벤트 네이밍 규칙

```
{도메인}.{액션}
```

**예시**:
- `user.created`
- `employee.updated`
- `salary.paid`
- `budget.approved`

### 12.2 이벤트 페이로드 구조

```typescript
interface BaseEvent {
  eventId: string;        // 이벤트 고유 ID (멱등성)
  eventType: string;      // 이벤트 타입
  timestamp: Date;        // 발생 시간
  tenantId: number;       // 테넌트 ID
  userId?: number;        // 발행자 ID
}

interface UserCreatedEvent extends BaseEvent {
  eventType: 'user.created';
  data: {
    userId: number;
    email: string;
    name: string;
  };
}
```

### 12.3 이벤트 버전 관리

이벤트 스키마가 변경될 때 버전을 명시합니다.

```typescript
interface UserCreatedEventV2 extends BaseEvent {
  eventType: 'user.created';
  version: 2;  // 버전 추가
  data: {
    userId: number;
    email: string;
    name: string;
    phoneNumber: string;  // 신규 필드
  };
}
```

---

## 13. 분산 트랜잭션 (Distributed Transactions)

### 13.1 Saga 패턴

여러 서비스에 걸친 트랜잭션은 Saga 패턴으로 처리합니다.

**예시: 급여 지급 프로세스**
```typescript
// payroll-service
async processSalary(employeeId: number, amount: number) {
  // 1. 급여 처리 레코드 생성
  const payroll = await this.prisma.payroll.create({
    data: { employeeId, amount, status: 'PENDING' },
  });
  
  // 2. 예산 차감 요청 이벤트 발행
  await this.eventBus.publish('budget.deduct.requested', {
    payrollId: payroll.id,
    amount,
  });
}

@EventPattern('budget.deduct.success')
async handleBudgetDeducted(data: BudgetDeductedEvent) {
  // 3. 급여 처리 완료
  await this.prisma.payroll.update({
    where: { id: data.payrollId },
    data: { status: 'COMPLETED' },
  });
}

@EventPattern('budget.deduct.failed')
async handleBudgetDeductFailed(data: BudgetDeductFailedEvent) {
  // 4. 보상 트랜잭션: 급여 처리 취소
  await this.prisma.payroll.update({
    where: { id: data.payrollId },
    data: { status: 'FAILED' },
  });
}
```

### 13.2 멱등성 보장

이벤트 중복 처리를 방지하기 위해 `eventId`를 저장합니다.

```typescript
@EventPattern('user.created')
async handleUserCreated(event: UserCreatedEvent) {
  // 이미 처리된 이벤트인지 확인
  const exists = await this.prisma.processedEvent.findUnique({
    where: { eventId: event.eventId },
  });
  
  if (exists) return;  // 중복 처리 방지
  
  // 이벤트 처리
  await this.prisma.employee.create({ data: event.data });
  
  // 처리 완료 기록
  await this.prisma.processedEvent.create({
    data: { eventId: event.eventId },
  });
}
```
