# Database per Service 개발 가이드

## 📋 개요

Database per Service 패턴을 올바르게 구현하기 위한 실전 가이드입니다.

---

## 1. 핵심 원칙

### ✅ 준수 사항

1. **각 서비스는 자신의 DB만 접근**
2. **Foreign Key 금지** (다른 서비스 테이블 참조 불가)
3. **ID만 저장** (`employeeId: string`)
4. **서비스 간 통신**: API 호출 또는 이벤트

### ❌ 금지 사항

1. 다른 서비스의 DB에 직접 쿼리
2. JOIN으로 다른 서비스 데이터 조회
3. Foreign Key Constraint 설정

---

## 2. 데이터 공유 패턴

### 패턴 1: API 호출 (동기)

**사용 시기**: 실시간 데이터 필요, 일관성 중요

```typescript
// payroll-service
async calculateSalary(empId: string) {
  // 1. 직원 정보 조회 (personnel-service API)
  const employee = await this.personnelClient.getEmployee(empId);
  
  // 2. 근태 정보 조회 (attendance-service API)
  const attendance = await this.attendanceClient.getAttendance(empId);
  
  // 3. 급여 계산
  return this.calculate(employee, attendance);
}
```

### 패턴 2: 이벤트 구독 (비동기)

**사용 시기**: 실시간성 불필요, 성능 중요

```typescript
// personnel-service: 이벤트 발행
@Put(':id')
async updateEmployee(id: string, dto: UpdateEmployeeDto) {
  const employee = await this.prisma.employee.update({...});
  
  await this.eventBus.publish('employee.updated', {
    id: employee.id,
    name: employee.name,
    departmentId: employee.departmentId,
  });
}

// payroll-service: 이벤트 구독 + 캐시 업데이트
@RabbitSubscribe('employee.updated')
async handleEmployeeUpdated(event) {
  await this.redis.set(`employee:${event.id}`, JSON.stringify(event));
}

// 급여 계산 시 캐시 사용
async calculateSalary(empId: string) {
  const cached = await this.redis.get(`employee:${empId}`);
  const employee = cached ? JSON.parse(cached) : await this.fetchFromAPI(empId);
  // ...
}
```

### 패턴 3: CQRS (Command Query Responsibility Segregation)

**사용 시기**: 복잡한 조회, 통계 생성

```typescript
// report-service: 비정규화된 Read Model
model EmployeeReport {
  empId        String   @id
  empName      String
  deptName     String   // Department 정보 복사
  salary       Decimal
  attendanceRate Float
  updatedAt    DateTime @updatedAt
}

// 이벤트 구독하여 Read Model 업데이트
@RabbitSubscribe('*.updated')
async updateReadModel(event) {
  await this.prisma.employeeReport.upsert({...});
}
```

---

## 3. 분산 트랜잭션 (Saga Pattern)

### Choreography Saga (이벤트 기반)

```typescript
// 1. budget-service: 예산 차감
@Post('/expenditure')
async createExpenditure(dto) {
  const expenditure = await this.prisma.expenditure.create({...});
  
  await this.eventBus.publish('expenditure.created', {
    id: expenditure.id,
    amount: expenditure.amount,
  });
}

// 2. accounting-service: 회계 반영
@RabbitSubscribe('expenditure.created')
async handleExpenditureCreated(event) {
  try {
    await this.createJournalEntry(event);
    await this.eventBus.publish('journal.created', {...});
  } catch (error) {
    // 보상 트랜잭션
    await this.eventBus.publish('expenditure.rollback', { id: event.id });
  }
}

// 3. budget-service: 롤백 처리
@RabbitSubscribe('expenditure.rollback')
async handleRollback(event) {
  await this.prisma.expenditure.delete({ where: { id: event.id } });
}
```

---

## 4. 개발 체크리스트

### 새 서비스 생성 시

- [ ] 독립 DB 인스턴스 생성 (`docker-compose.infra.yml`)
- [ ] Prisma 스키마 파일 생성 (`libs/shared/database/[service]`)
- [ ] 모든 테이블에 `tenantId` 필드 추가
- [ ] Row-Level Security 정책 적용
- [ ] Service Client 생성 (`libs/shared/http`)

### 다른 서비스 데이터 필요 시

- [ ] Foreign Key 사용하지 않음
- [ ] ID만 저장 (`employeeId: string`)
- [ ] API Client로 데이터 조회 또는
- [ ] 이벤트 구독 + 캐싱

---

## 5. 참조 문서

- [마이크로서비스 아키텍처 v2.0](./microservices-architecture-review.md)
- [멀티테넌시 가이드](./multitenancy.md)
