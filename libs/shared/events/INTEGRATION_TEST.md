# RabbitMQ 이벤트 시스템 통합 테스트 예제

## 개요

이 예제는 실제 RabbitMQ 서버를 사용하여 이벤트 발행 및 수신을 테스트하는 방법을 보여줍니다.

## 사전 준비

### 1. RabbitMQ 실행

```bash
cd dev-environment
docker compose -f docker-compose.infra.yml up -d rabbitmq
```

### 2. RabbitMQ Management UI 확인

브라우저에서 http://localhost:15672 접속

- Username: admin
- Password: admin

## 통합 테스트 실행 방법

### 테스트 서비스 1: 이벤트 발행자 (personnel-service)

`apps/hr/personnel-service/src/modules/employee/employee.service.ts`에서 이벤트를 발행합니다:

```typescript
import { Injectable } from '@nestjs/common';
import { EventEmitterService, EmployeeCreatedEvent } from '@all-erp/shared/events';
import { PrismaService } from '@all-erp/shared/database/personnel';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService, private eventEmitter: EventEmitterService) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const employee = await this.prisma.employee.create({ data: dto });

    // 이벤트 발행
    await this.eventEmitter.emit<EmployeeCreatedEvent>('employee.created', {
      tenantId: employee.tenantId,
      userId: 1, // 현재 사용자 ID
      data: {
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        name: employee.name,
        email: employee.email,
        departmentId: employee.departmentId,
        positionId: employee.positionId,
        hireDate: employee.hireDate,
      },
    });

    console.log(`[Event Published] employee.created for ${employee.name}`);
    return employee;
  }
}
```

### 테스트 서비스 2: 이벤트 수신자 (payroll-service)

`apps/hr/payroll-service/src/modules/employee-cache/employee-cache.controller.ts`에서 이벤트를 수신합니다:

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EmployeeCreatedEvent } from '@all-erp/shared/events';

@Controller()
export class EmployeeCacheController {
  constructor(private employeeCacheService: EmployeeCacheService) {}

  @EventPattern('employee.created')
  async handleEmployeeCreated(@Payload() event: EmployeeCreatedEvent, @Ctx() context: RmqContext) {
    console.log(`[Event Received] employee.created:`, {
      eventId: event.eventId,
      employeeId: event.data.employeeId,
      name: event.data.name,
    });

    // 로컬 캐시에 직원 정보 저장
    await this.employeeCacheService.createCache({
      employeeId: event.data.employeeId,
      employeeNumber: event.data.employeeNumber,
      name: event.data.name,
      email: event.data.email,
      departmentId: event.data.departmentId,
      positionId: event.data.positionId,
    });

    // 메시지 확인 (ACK)
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
```

### 테스트 서비스 3: 마이크로서비스 설정

`apps/hr/payroll-service/src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // HTTP 서버
  const app = await NestFactory.create(AppModule);

  // RabbitMQ 마이크로서비스
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'],
      queue: 'payroll_events_queue',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3012);

  console.log(`Payroll Service is running on: http://localhost:3012`);
  console.log(`Listening to RabbitMQ events...`);
}

bootstrap();
```

## 테스트 시나리오

### 시나리오 1: 직원 생성 이벤트 발행 및 수신

1. **personnel-service 실행**

```bash
pnpm nx serve personnel-service
```

2. **payroll-service 실행**

```bash
pnpm nx serve payroll-service
```

3. **직원 생성 API 호출**

```bash
curl -X POST http://localhost:3011/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": 1,
    "employeeNumber": "EMP001",
    "name": "홍길동",
    "email": "hong@example.com",
    "departmentId": 10,
    "positionId": 5,
    "hireDate": "2024-01-01"
  }'
```

4. **로그 확인**

   - personnel-service 로그: `[Event Published] employee.created for 홍길동`
   - payroll-service 로그: `[Event Received] employee.created: { eventId: '...', employeeId: 1, name: '홍길동' }`

5. **RabbitMQ Management UI 확인**
   - Queues 탭에서 `events_queue`, `payroll_events_queue` 확인
   - Message rates 확인
   - Get messages로 큐 내용 확인

## 검증 포인트

### ✅ 성공 기준

- [ ] RabbitMQ 컨테이너가 정상적으로 실행 중
- [ ] Management UI (http://localhost:15672)에 접속 가능
- [ ] personnel-service에서 이벤트 발행 시 에러 없음
- [ ] payroll-service에서 이벤트 수신 로그 확인
- [ ] Management UI에서 메시지 전송 통계 확인 가능
- [ ] 이벤트 데이터가 올바른 구조 (BaseEvent 준수)

### 🔍 확인 사항

- eventId가 고유한 UUID로 생성되는지
- timestamp가 자동으로 설정되는지
- tenantId가 모든 이벤트에 포함되는지
- 메시지가 큐에 쌓이지 않고 즉시 소비되는지

## 문제 해결

### RabbitMQ 연결 실패

```bash
# RabbitMQ 상태 확인
docker logs all-erp-rabbitmq

# RabbitMQ 재시작
docker restart all-erp-rabbitmq
```

### 이벤트가 수신되지 않음

1. RabbitMQ Management UI에서 Exchange와 Queue Binding 확인
2. payroll-service의 마이크로서비스가 정상적으로 시작되었는지 확인
3. Queue 이름이 올바른지 확인

### 메시지 중복 수신

- 멱등성 처리: eventId를 저장하여 중복 처리 방지
- ACK 확인: 메시지 처리 후 반드시 ACK 전송

## 다음 단계

1. ✅ 이벤트 핸들러에 에러 처리 추가
2. ✅ Dead Letter Queue (DLQ) 설정
3. ✅ 이벤트 재시도 로직 구현
4. ✅ 이벤트 감사 로그 (Audit Log) 추가
