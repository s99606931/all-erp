# TASK-P3-01: RabbitMQ 설정 및 공통 모듈

## 📋 작업 개요
- **Phase**: Phase 3 (서비스 간 통신 구현)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P2-04 (모든 서비스 DB 연결 완료)

## 🎯 목표

RabbitMQ 메시지 브로커를 설정하고, 서비스 간 이벤트 기반 통신을 위한 공통 모듈을 개발합니다.

## 📝 상세 작업 내용

### 1. RabbitMQ 설정

**docker-compose.infra.yml에 추가**:
```yaml
rabbitmq:
  image: rabbitmq:3-management-alpine
  container_name: rabbitmq
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
  ports:
    - "5672:5672"    # AMQP port
    - "15672:15672"  # Management UI
  volumes:
    - rabbitmq-data:/var/lib/rabbitmq

volumes:
  rabbitmq-data:
```

### 2. 공통 이벤트 모듈 개발

**libs/shared/events** 폴더 생성:

```
libs/shared/events/
├── src/
│   ├── lib/
│   │   ├── base-event.interface.ts
│   │   ├── event-emitter.service.ts
│   │   ├── event-handler.decorator.ts
│   │   └── events/
│   │       ├── user.events.ts
│   │       ├── employee.events.ts
│   │       ├── payroll.events.ts
│   │       └── budget.events.ts
│   └── index.ts
└── package.json
```

**BaseEvent 인터페이스** (`base-event.interface.ts`):
```typescript
export interface BaseEvent {
  eventId: string;        // UUID
  eventType: string;      // 예: 'employee.created'
  timestamp: Date;
  tenantId: number;
  userId?: number;
  correlationId?: string;
}
```

**이벤트 정의 예시** (`employee.events.ts`):
```typescript
import { BaseEvent } from '../base-event.interface';

export interface EmployeeCreatedEvent extends BaseEvent {
  eventType: 'employee.created';
  data: {
    employeeId: number;
    name: string;
    email: string;
    departmentId: number;
    hireDate: Date;
  };
}

export interface EmployeeUpdatedEvent extends BaseEvent {
  eventType: 'employee.updated';
  data: {
    employeeId: number;
    updatedFields: string[];  // 변경된 필드 목록
  };
}

export interface EmployeeTerminatedEvent extends BaseEvent {
  eventType: 'employee.terminated';
  data: {
    employeeId: number;
    terminationDate: Date;
    reason: string;
  };
}
```

### 3. EventEmitter Service

**event-emitter.service.ts**:
```typescript
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { BaseEvent } from './base-event.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventEmitterService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'events_queue',
        queueOptions: { durable: true },
      },
    });
  }

  async emit<T extends BaseEvent>(eventType: string, data: Omit<T, 'eventId' | 'eventType' | 'timestamp'>): Promise<void> {
    const event: T = {
      ...data,
      eventId: uuidv4(),
      eventType,
      timestamp: new Date(),
    } as T;

    await this.client.emit(eventType, event).toPromise();
    console.log(`[Event Published] ${eventType}:`, event.eventId);
  }
}
```

### 4. NestJS 모듈 설정

**shared-events.module.ts**:
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventEmitterService } from './event-emitter.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'events_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class SharedEventsModule {}
```

### 5. 이벤트 핸들러 예시

**personnel-service에서 이벤트 발행**:
```typescript
// personnel-service/src/modules/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitterService } from '@all-erp/shared/events';
import { EmployeeCreatedEvent } from '@all-erp/shared/events';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaClient,
    private eventEmitter: EventEmitterService,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const employee = await this.prisma.employee.create({ data: dto });

    // 이벤트 발행
    await this.eventEmitter.emit<EmployeeCreatedEvent>('employee.created', {
      tenantId: employee.tenantId,
      data: {
        employeeId: employee.id,
        name: employee.name,
        email: employee.email,
        departmentId: employee.departmentId,
        hireDate: employee.hireDate,
      },
    });

    return employee;
  }
}
```

**payroll-service에서 이벤트 수신**:
```typescript
// payroll-service/src/modules/employee-cache/employee-cache.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmployeeCreatedEvent } from '@all-erp/shared/events';

@Controller()
export class EmployeeCacheController {
  constructor(private employeeCacheService: EmployeeCacheService) {}

  @EventPattern('employee.created')
  async handleEmployeeCreated(@Payload() event: EmployeeCreatedEvent) {
    console.log(`[Event Received] employee.created: ${event.eventId}`);
    await this.employeeCacheService.createCache(event);
  }
}
```

## ✅ 완료 조건

- [ ] RabbitMQ 컨테이너 정상 실행
- [ ] Management UI 접속 확인 (http://localhost:15672)
- [ ] `libs/shared/events` 모듈 생성 및 패키지 publish
- [ ] BaseEvent 인터페이스 정의
- [ ] 주요 도메인 이벤트 정의 (최소 10개)
- [ ] EventEmitterService 구현
- [ ] 이벤트 발행/수신 통합 테스트 성공

## 🔧 실행 명령어

```bash
# RabbitMQ 실행
cd dev-environment
docker compose -f docker-compose.infra.yml up -d rabbitmq

# Management UI 확인
open http://localhost:15672

# 공통 이벤트 모듈 빌드
cd libs/shared/events
pnpm build
```

## 📚 참고 문서

- [이벤트 기반 아키텍처 가이드](file:///data/all-erp/docs/human/event_driven_guide.md)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ 공식 문서](https://www.rabbitmq.com/)

## 🚨 주의사항

- 이벤트 페이로드는 최소화 (변경 사실만 전달)
- eventId를 통한 멱등성 보장 필수
- 모든 이벤트에 tenantId 포함 (멀티테넌시)
- 이벤트 타입 네이밍: `{domain}.{action}` (예: `employee.created`)
