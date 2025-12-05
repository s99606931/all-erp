# @all-erp/shared/events

## 개요

RabbitMQ를 통한 서비스 간 이벤트 기반 통신을 위한 공통 라이브러리입니다.
Database per Service 패턴에서 서비스 간 데이터 동기화 및 느슨한 결합을 위해 사용됩니다.

## 주요 기능

- ✅ **BaseEvent 인터페이스**: 모든 도메인 이벤트의 기본 구조 정의
- ✅ **EventEmitterService**: RabbitMQ를 통한 이벤트 발행
- ✅ **도메인 이벤트**: 8개 도메인의 30+ 이벤트 타입 정의
- ✅ **멀티테넌시 지원**: 모든 이벤트에 tenantId 포함
- ✅ **멱등성 보장**: 고유한 eventId 자동 생성

## 설치

```bash
pnpm add @all-erp/shared/events
```

## 사용법

### 1. 모듈 import

```typescript
import { Module } from '@nestjs/common';
import { SharedEventsModule } from '@all-erp/shared/events';

@Module({
  imports: [SharedEventsModule],
  // ...
})
export class AppModule {}
```

### 2. 이벤트 발행

```typescript
import { Injectable } from '@nestjs/common';
import { EventEmitterService, EmployeeCreatedEvent } from '@all-erp/shared/events';

@Injectable()
export class EmployeeService {
  constructor(private eventEmitter: EventEmitterService) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const employee = await this.prisma.employee.create({ data: dto });

    // 이벤트 발행
    await this.eventEmitter.emit<EmployeeCreatedEvent>('employee.created', {
      tenantId: employee.tenantId,
      userId: currentUserId,
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

    return employee;
  }
}
```

### 3. 이벤트 수신

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmployeeCreatedEvent } from '@all-erp/shared/events';

@Controller()
export class EmployeeCacheController {
  constructor(private employeeCacheService: EmployeeCacheService) {}

  @EventPattern('employee.created')
  async handleEmployeeCreated(@Payload() event: EmployeeCreatedEvent) {
    console.log(`[Event Received] employee.created: ${event.eventId}`);

    // 이벤트 처리 (예: 로컬 캐시 업데이트)
    await this.employeeCacheService.createCache(event);
  }
}
```

## 도메인 이벤트

### User (사용자)

- `user.created` - 사용자 생성
- `user.updated` - 사용자 업데이트
- `user.deleted` - 사용자 삭제
- `user.role.changed` - 권한 변경

### Employee (직원)

- `employee.created` - 직원 생성
- `employee.updated` - 직원 정보 업데이트
- `employee.terminated` - 직원 퇴사
- `employee.department.changed` - 부서 이동
- `employee.position.changed` - 직급 변경

### Payroll (급여)

- `payroll.calculated` - 급여 계산 완료
- `payroll.approved` - 급여 승인
- `payroll.paid` - 급여 지급 완료
- `payroll.item.changed` - 급여 항목 변경

### Budget (예산)

- `budget.created` - 예산 생성
- `budget.approved` - 예산 승인
- `budget.executed` - 예산 집행
- `budget.exceeded` - 예산 초과

### Attendance (근태)

- `attendance.recorded` - 근태 기록
- `leave.requested` - 휴가 신청
- `leave.approved` - 휴가 승인
- `leave.rejected` - 휴가 반려

### Asset (자산)

- `asset.registered` - 자산 등록
- `asset.assigned` - 자산 배정
- `asset.returned` - 자산 회수
- `asset.disposed` - 자산 폐기

### Supply (물품)

- `supply.requested` - 물품 요청
- `supply.request.approved` - 물품 요청 승인
- `supply.issued` - 물품 출고
- `supply.low.stock` - 재고 부족 알림

### Accounting (회계)

- `voucher.created` - 전표 생성
- `voucher.approved` - 전표 승인
- `settlement.completed` - 결산 완료
- `account.changed` - 계정과목 변경

## 환경 변수

```bash
# RabbitMQ 연결 URL
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

## 주의사항

⚠️ **이벤트 설계 원칙**

- 이벤트 페이로드는 최소화 (변경 사실만 전달)
- eventId를 통한 멱등성 보장 필수
- 모든 이벤트에 tenantId 포함 (멀티테넌시)
- 이벤트 타입 네이밍: `{domain}.{action}` (예: `employee.created`)

## 참고 문서

- [이벤트 기반 아키텍처 가이드](../../../docs/human/event_driven_guide.md)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ 공식 문서](https://www.rabbitmq.com/)
