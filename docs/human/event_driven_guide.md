# 이벤트 기반 아키텍처 가이드 (Event-Driven Architecture Guide)

> RabbitMQ 기반 이벤트 기반 마이크로서비스 통신 가이드

## 1. 개요

본 문서는 ALL-ERP 프로젝트에서 RabbitMQ를 사용한 이벤트 기반 아키텍처(Event-Driven Architecture, EDA) 구현 방법을 제공합니다.

## 2. 이벤트 기반 아키텍처란?

서비스 간 **느슨한 결합**(Loose Coupling)을 유지하면서 데이터 변경을 비동기적으로 전파하는 아키텍처 패턴입니다.

**핵심 개념**:
- **이벤트 발행자(Publisher)**: 데이터 변경 시 이벤트 발행
- **이벤트 구독자(Subscriber)**: 관심 있는 이벤트 수신 및 처리
- **메시지 브로커(RabbitMQ)**: 이벤트 라우팅 및 전달

---

## 3. 이벤트 네이밍 규칙

### 3.1 네이밍 형식

```
{도메인}.{엔티티}.{액션}
```

**규칙**:
- 소문자 사용
- 점(`.`)으로 구분
- 과거형 사용 (이미 발생한 사실)

**예시**:
```
user.created
employee.updated
employee.deleted
salary.paid
budget.approved
accounting.entry.created
```

### 3.2 도메인별 이벤트

| 도메인 | 이벤트 예시 |
|--------|------------|
| **인증** | `user.created`, `user.deleted`, `password.changed` |
| **인사** | `employee.created`, `employee.updated`, `employee.terminated` |
| **급여** | `salary.paid`, `payroll.processed` |
| **예산** | `budget.created`, `budget.approved`, `budget.exceeded` |
| **회계** | `accounting.entry.created`, `settlement.completed` |

---

## 4. 이벤트 페이로드 설계

### 4.1 기본 구조

모든 이벤트는 다음 기본 구조를 가집니다:

```typescript
interface BaseEvent {
  eventId: string;        // 고유 ID (UUID) - 멱등성 보장
  eventType: string;      // 이벤트 타입 (예: 'employee.updated')
  timestamp: Date;        // 발생 시간 (ISO 8601)
  tenantId: number;       // 테넌트 ID (멀티테넌시)
  userId?: number;        // 발행자 ID (선택)
  correlationId?: string; // 분산 추적용 ID (선택)
}
```

### 4.2 도메인 이벤트 예시

**직원 생성 이벤트**:
```typescript
interface EmployeeCreatedEvent extends BaseEvent {
  eventType: 'employee.created';
  data: {
    employeeId: number;
    name: string;
    email: string;
    departmentId: number;
    position: string;
    hireDate: Date;
  };
}
```

**급여 지급 이벤트**:
```typescript
interface SalaryPaidEvent extends BaseEvent {
  eventType: 'salary.paid';
  data: {
    payrollId: number;
    employeeId: number;
    amount: number;
    paymentDate: Date;
  };
}
```

**예산 승인 이벤트**:
```typescript
interface BudgetApprovedEvent extends BaseEvent {
  eventType: 'budget.approved';
  data: {
    budgetId: number;
    amount: number;
    approvedBy: number;
    approvedAt: Date;
  };
}
```

### 4.3 이벤트 페이로드 최소화

**원칙**: 이벤트는 **변경 사실**만 전달하고, 상세 데이터는 API 조회로 가져옵니다.

```typescript
// ✅ 좋은 예: 최소한의 정보만 포함
{
  eventId: 'uuid',
  eventType: 'employee.updated',
  data: {
    employeeId: 123,
    updatedFields: ['name', 'departmentId'],  // 어떤 필드가 변경되었는지
  }
}

// ❌ 나쁜 예: 과도한 정보 포함
{
  eventId: 'uuid',
  eventType: 'employee.updated',
  data: {
    employeeId: 123,
    name: '홍길동',
    email: 'hong@example.com',
    address: '서울시...',
    phoneNumber: '010-1234-5678',
    // ... 너무 많은 필드
  }
}
```

---

## 5. 이벤트 발행 (Publishing)

### 5.1 NestJS에서 이벤트 발행

**Step 1: EventEmitter2 inject**
```typescript
// personnel-service/src/modules/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaClient,
    private eventBus: EventEmitter2,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    // 1. DB에 저장
    const employee = await this.prisma.employee.create({
      data: dto,
    });

    // 2. 이벤트 발행
    await this.eventBus.emit('employee.created', {
      eventId: uuidv4(),
      eventType: 'employee.created',
      timestamp: new Date(),
      tenantId: employee.tenantId,
      data: {
        employeeId: employee.id,
        name: employee.name,
        email: employee.email,
        departmentId: employee.departmentId,
      },
    });

    return employee;
  }
}
```

### 5.2 트랜잭션과 이벤트 발행

**문제**: DB 트랜잭션이 롤백되어도 이벤트는 이미 발행됨

**해결**: Transactional Outbox 패턴

```typescript
async createEmployee(dto: CreateEmployeeDto) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. 직원 생성
    const employee = await tx.employee.create({ data: dto });

    // 2. Outbox 테이블에 이벤트 저장
    await tx.outboxEvent.create({
      data: {
        eventId: uuidv4(),
        eventType: 'employee.created',
        payload: JSON.stringify({
          employeeId: employee.id,
          name: employee.name,
        }),
        status: 'PENDING',
      },
    });

    return employee;
  });
}

// 별도 워커에서 Outbox 이벤트를 읽어 발행
@Cron('*/5 * * * * *')  // 5초마다 실행
async processOutboxEvents() {
  const events = await this.prisma.outboxEvent.findMany({
    where: { status: 'PENDING' },
    take: 100,
  });

  for (const event of events) {
    await this.eventBus.emit(event.eventType, JSON.parse(event.payload));
    
    await this.prisma.outboxEvent.update({
      where: { id: event.id },
      data: { status: 'PUBLISHED' },
    });
  }
}
```

---

## 6. 이벤트 수신 (Subscribing)

### 6.1 이벤트 핸들러 작성

```typescript
// payroll-service/src/modules/employee-cache/employee-cache.service.ts
import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class EmployeeCacheService {
  constructor(private prisma: PrismaClient) {}

  @EventPattern('employee.created')
  async handleEmployeeCreated(event: EmployeeCreatedEvent) {
    console.log(`이벤트 수신: ${event.eventType}, 직원 ID: ${event.data.employeeId}`);

    // 멱등성 확인
    const processed = await this.isEventProcessed(event.eventId);
    if (processed) {
      console.log('이벤트 이미 처리됨:', event.eventId);
      return;
    }

    // 로컬 캐시에 저장
    await this.prisma.employeeCache.create({
      data: {
        employeeId: event.data.employeeId,
        name: event.data.name,
        email: event.data.email,
        tenantId: event.tenantId,
      },
    });

    // 처리 완료 기록
    await this.markEventAsProcessed(event.eventId);
  }

  @EventPattern('employee.updated')
  async handleEmployeeUpdated(event: EmployeeUpdatedEvent) {
    const processed = await this.isEventProcessed(event.eventId);
    if (processed) return;

    await this.prisma.employeeCache.update({
      where: { employeeId: event.data.employeeId },
      data: {
        name: event.data.name,
        email: event.data.email,
      },
    });

    await this.markEventAsProcessed(event.eventId);
  }

  // 멱등성 보장 헬퍼 메서드
  private async isEventProcessed(eventId: string): Promise<boolean> {
    const event = await this.prisma.processedEvent.findUnique({
      where: { eventId },
    });
    return !!event;
  }

  private async markEventAsProcessed(eventId: string): Promise<void> {
    await this.prisma.processedEvent.create({
      data: { eventId, processedAt: new Date() },
    });
  }
}
```

### 6.2 에러 처리 및 재시도

```typescript
@EventPattern('employee.created')
async handleEmployeeCreated(event: EmployeeCreatedEvent) {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      // 이벤트 처리 로직
      await this.processEmployee(event);
      return;  // 성공 시 종료
    } catch (error) {
      retryCount++;
      console.error(`이벤트 처리 실패 (시도 ${retryCount}/${maxRetries}):`, error);

      if (retryCount >= maxRetries) {
        // Dead Letter Queue로 전송
        await this.sendToDeadLetterQueue(event, error);
        throw error;
      }

      // 지수 백오프 (Exponential Backoff)
      await this.sleep(1000 * Math.pow(2, retryCount));
    }
  }
}

private sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 7. 멱등성 보장 (Idempotency)

### 7.1 왜 멱등성이 필요한가?

- 네트워크 오류로 이벤트 중복 수신 가능
- RabbitMQ는 **At-Least-Once** 전달 보장 (최소 1회 전달)
- 같은 이벤트를 여러 번 처리해도 결과가 동일해야 함

### 7.2 멱등성 구현 방법

**DB 테이블 설계**:
```sql
CREATE TABLE processed_events (
  event_id VARCHAR(36) PRIMARY KEY,
  processed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_processed_events_created_at ON processed_events(created_at);
```

**Prisma 스키마**:
```prisma
model ProcessedEvent {
  eventId     String   @id @map("event_id")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("processed_events")
}
```

**처리 로직**:
```typescript
async processEvent(event: BaseEvent) {
  // 1. 이미 처리된 이벤트인지 확인
  const exists = await this.prisma.processedEvent.findUnique({
    where: { eventId: event.eventId },
  });

  if (exists) {
    console.log('이벤트 이미 처리됨:', event.eventId);
    return;  // 중복 처리 방지
  }

  // 2. 트랜잭션으로 처리 + 기록
  await this.prisma.$transaction(async (tx) => {
    // 비즈니스 로직 처리
    await this.doSomething(tx, event);

    // 처리 완료 기록
    await tx.processedEvent.create({
      data: {
        eventId: event.eventId,
        processedAt: new Date(),
      },
    });
  });
}
```

---

## 8. RabbitMQ 설정

### 8.1 연결 설정

```typescript
// libs/shared/infra/src/lib/rabbitmq/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'events_queue',
          queueOptions: {
            durable: true,  // Queue 지속성
          },
          prefetchCount: 10,  // 동시 처리 메시지 수
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
```

### 8.2 Exchange 및 Routing Key

**Topic Exchange 사용**:
```typescript
// main.ts
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://guest:guest@localhost:5672'],
    queue: 'payroll_service_queue',
    queueOptions: { durable: true },
    noAck: false,  // 수동 Ack 활성화
    exchangeOptions: {
      type: 'topic',  // Topic Exchange
      durable: true,
    },
  },
});
```

**Routing Pattern**:
```
employee.#       : 직원 관련 모든 이벤트
employee.created : 직원 생성 이벤트만
employee.updated : 직원 업데이트 이벤트만
*.created        : 모든 생성 이벤트
```

---

## 9. 모니터링 및 디버깅

### 9.1 RabbitMQ Management UI

```bash
# RabbitMQ Management Plugin 활성화
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_management

# 웹 UI 접속
http://localhost:15672
# 기본 계정: guest / guest
```

### 9.2 이벤트 로깅

```typescript
@EventPattern('employee.created')
async handleEmployeeCreated(event: EmployeeCreatedEvent) {
  const logger = new Logger('EmployeeEventHandler');
  
  logger.log({
    message: '이벤트 수신',
    eventType: event.eventType,
    eventId: event.eventId,
    employeeId: event.data.employeeId,
    timestamp: event.timestamp,
  });

  try {
    await this.processEmployee(event);
    logger.log({ message: '이벤트 처리 완료', eventId: event.eventId });
  } catch (error) {
    logger.error({ message: '이벤트 처리 실패', eventId: event.eventId, error });
    throw error;
  }
}
```

---

## 10. 체크리스트

### 이벤트 발행 시

- [ ] 이벤트 네이밍 규칙 준수 (`{domain}.{action}`)
- [ ] `eventId` (UUID) 포함
- [ ] `timestamp` 포함
- [ ] `tenantId` 포함 (멀티테넌시)
- [ ] 페이로드 최소화 (변경 사실만 전달)
- [ ] Transactional Outbox 패턴 고려

### 이벤트 수신 시

- [ ] 멱등성 보장 (`eventId` 체크)
- [ ] 에러 처리 및 재시도 로직 구현
- [ ] Dead Letter Queue 설정
- [ ] 로깅 및 모니터링
- [ ] 타임아웃 설정

---

## 11. 참고 문서

- [마이크로서비스 개발 가이드](file:///data/all-erp/docs/human/microservices_guide.md)
- [API 설계 가이드](file:///data/all-erp/docs/human/api_design_guide.md)
- [Database per Service 가이드](file:///data/all-erp/docs/architecture/database-per-service-guide.md)
- [RabbitMQ 공식 문서](https://www.rabbitmq.com/documentation.html)
