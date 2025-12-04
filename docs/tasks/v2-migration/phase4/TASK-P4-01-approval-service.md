# TASK-P4-01: Approval Service 개발

## 📋 작업 개요
- **Phase**: Phase 4 (신규 서비스 개발)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P3-04 (서비스 간 통신 구현 완료)

## 🎯 목표

결재(전자결재) 기능을 담당하는 독립적인 마이크로서비스를 개발합니다.

## 📝 상세 작업 내용

### 1. 서비스 스캐폴딩

**NestJS 앱 생성**:
```bash
cd apps
mkdir -p platform
cd platform
pnpm nx g @nx/nest:app approval-service
```

**폴더 구조**:
```
apps/platform/approval-service/
├── src/
│   ├── app/
│   │   ├── app.module.ts
│   │   └── modules/
│   │       ├── approval/
│   │       │   ├── approval.controller.ts
│   │       │   ├── approval.service.ts
│   │       │   ├── approval.module.ts
│   │       │   └── dto/
│   │       ├── approval-line/      # 결재선
│   │       └── approval-history/   # 결재 이력
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
```

### 2. Prisma 스키마 설계

**approval-service/prisma/schema.prisma**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 결재 요청
model ApprovalRequest {
  id              Int      @id @default(autoincrement())
  requestType     String   @map("request_type")  // 예: PAYROLL, BUDGET, PURCHASE
  referenceId     Int      @map("reference_id")  // 원본 문서 ID
  referenceType   String   @map("reference_type")  // 원본 문서 타입
  requesterId     Int      @map("requester_id")  // 요청자 ID (auth-service)
  status          String   // PENDING, APPROVED, REJECTED, CANCELED
  title           String
  description     String?
  priority        String   @default("NORMAL")  // URGENT, HIGH, NORMAL, LOW
  tenantId        Int      @map("tenant_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  approvalLines   ApprovalLine[]
  histories       ApprovalHistory[]

  @@index([tenantId])
  @@index([requesterId])
  @@index([status])
  @@map("approval_requests")
}

// 결재선
model ApprovalLine {
  id                Int      @id @default(autoincrement())
  approvalRequestId Int      @map("approval_request_id")
  approverId        Int      @map("approver_id")  // 결재자 ID (auth-service)
  sequence          Int      // 결재 순서
  status            String   @default("PENDING")  // PENDING, APPROVED, REJECTED
  comment           String?
  approvedAt        DateTime? @map("approved_at")
  tenantId          Int      @map("tenant_id")
  createdAt         DateTime @default(now()) @map("created_at")

  approvalRequest   ApprovalRequest @relation(fields: [approvalRequestId], references: [id])

  @@unique([approvalRequestId, sequence])
  @@index([approverId])
  @@map("approval_lines")
}

// 결재 이력
model ApprovalHistory {
  id                Int      @id @default(autoincrement())
  approvalRequestId Int      @map("approval_request_id")
  action            String   // SUBMITTED, APPROVED, REJECTED, CANCELED
  actorId           Int      @map("actor_id")  // 행위자 ID
  comment           String?
  tenantId          Int      @map("tenant_id")
  createdAt         DateTime @default(now()) @map("created_at")

  approvalRequest   ApprovalRequest @relation(fields: [approvalRequestId], references: [id])

  @@index([approvalRequestId])
  @@map("approval_histories")
}

// 멱등성
model ProcessedEvent {
  eventId     String   @id @map("event_id")
  processedAt DateTime @map("processed_at")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("processed_events")
}
```

### 3. 핵심 API 구현

**ApprovalController**:
```typescript
import { Controller, Post, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('approval')
@Controller('api/v1/approvals')
export class ApprovalController {
  constructor(private approvalService: ApprovalService) {}

  @Post()
  @ApiOperation({ summary: '결재 요청 생성' })
  async createApprovalRequest(@Body() dto: CreateApprovalRequestDto) {
    return this.approvalService.createRequest(dto);
  }

  @Get()
  @ApiOperation({ summary: '결재 목록 조회' })
  async getApprovalRequests(@Query() query: GetApprovalRequestsDto) {
    return this.approvalService.getRequests(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '결재 상세 조회' })
  async getApprovalRequest(@Param('id') id: number) {
    return this.approvalService.getRequest(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: '결재 승인' })
  async approveRequest(@Param('id') id: number, @Body() dto: ApproveRequestDto) {
    return this.approvalService.approve(id, dto);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '결재 반려' })
  async rejectRequest(@Param('id') id: number, @Body() dto: RejectRequestDto) {
    return this.approvalService.reject(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: '결재 취소' })
  async cancelRequest(@Param('id') id: number) {
    return this.approvalService.cancel(id);
  }
}
```

### 4. 이벤트 처리

**이벤트 발행** (결재 완료 시):
```typescript
// approval.service.ts
async approve(id: number, dto: ApproveRequestDto) {
  const approval = await this.prisma.approvalRequest.findUnique({
    where: { id },
    include: { approvalLines: true },
  });

  // 현재 결재선 승인 처리
  await this.prisma.approvalLine.update({
    where: { id: dto.approvalLineId },
    data: { status: 'APPROVED', comment: dto.comment, approvedAt: new Date() },
  });

  // 모든 결재선이 승인되었는지 확인
  const allApproved = approval.approvalLines.every(line => 
    line.id === dto.approvalLineId || line.status === 'APPROVED'
  );

  if (allApproved) {
    await this.prisma.approvalRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // 이벤트 발행
    await this.eventEmitter.emit('approval.completed', {
      tenantId: approval.tenantId,
      data: {
        approvalRequestId: approval.id,
        referenceType: approval.referenceType,
        referenceId: approval.referenceId,
        status: 'APPROVED',
      },
    });
  }

  return approval;
}
```

**이벤트 수신** (다른 서비스로부터):
```typescript
// approval.controller.ts
@EventPattern('payroll.submitted')
async handlePayrollSubmitted(event: PayrollSubmittedEvent) {
  // 급여 처리가 제출되면 자동으로 결재 요청 생성
  await this.approvalService.createRequest({
    requestType: 'PAYROLL',
    referenceId: event.data.payrollId,
    referenceType: 'Payroll',
    requesterId: event.userId,
    title: `급여 처리 결재 요청`,
    tenantId: event.tenantId,
  });
}
```

### 5. main.ts 설정

```typescript
import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'approval-service',
    port: 3041,
    swagger: {
      title: 'Approval Service API',
      description: '결재 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
```

## ✅ 완료 조건

- [ ] approval-service 앱 생성
- [ ] Prisma 스키마 정의 및 마이그레이션
- [ ] CRUD API 구현 (생성, 조회, 승인, 반려, 취소)
- [ ] 결재 이벤트 발행 구현
- [ ] 다른 서비스 이벤트 수신 구현
- [ ] Swagger 문서화
- [ ] 단위 테스트 작성 (커버리지 80% 이상)
- [ ] Docker Compose에 추가

## 🔧 실행 명령어

```bash
# 서비스 실행
pnpm nx serve approval-service

# Swagger 확인
open http://localhost:3041/api/docs

# 테스트
pnpm nx test approval-service
```

## 📚 참고 문서

- [마이크로서비스 개발 가이드](file:///data/all-erp/docs/human/microservices_guide.md)
- [API 설계 가이드](file:///data/all-erp/docs/human/api_design_guide.md)

## 🚨 주의사항

- 결재자 정보는 auth-service API로 조회 (외래키 없음)
- 결재 완료 시 반드시 이벤트 발행
- 순차 결재 / 병렬 결재 로직 구분
- 멀티테넌시 보장 (모든 쿼리에 tenantId 필터)
