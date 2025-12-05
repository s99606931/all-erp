# 이벤트 카탈로그 (Event Catalog)

> 시스템 전체에서 사용하는 모든 도메인 이벤트의 완전한 목록과 스키마 정의

**최종 업데이트**: 2025-12-05  
**총 이벤트 수**: 61개  
**도메인 수**: 14개

---

## 📋 목차

1. [개요](#개요)
2. [이벤트 네이밍 규칙](#이벤트-네이밍-규칙)
3. [도메인별 이벤트](#도메인별-이벤트)
4. [이벤트 스키마 상세](#이벤트-스키마-상세)
5. [사용 가이드](#사용-가이드)

---

## 개요

본 문서는 ALL-ERP 시스템의 모든 도메인 이벤트를 체계적으로 정리한 카탈로그입니다.
각 이벤트는 서비스 간 느슨한 결합(Loose Coupling)과 데이터 동기화를 위해 사용됩니다.

### 이벤트 기반 아키텍처 원칙

- **Database per Service**: 각 서비스는 독립 DB를 가지며, 이벤트로 데이터 동기화
- **멱등성 보장**: 모든 이벤트는 고유한 `eventId`를 가짐
- **멀티테넌시**: 모든 이벤트에 `tenantId` 포함
- **추적성**: `correlationId`로 분산 트랜잭션 추적

---

## 이벤트 네이밍 규칙

모든 이벤트는 다음 형식을 따릅니다:

```
{domain}.{action}[.{detail}]
```

**예시**:

- `employee.created` - 직원 생성
- `employee.department.changed` - 직원 부서 변경
- `approval.requested` - 결재 요청

---

## 도메인별 이벤트

| 도메인                                      | 이벤트 수 | 설명                  |
| ------------------------------------------- | --------- | --------------------- |
| [User](#1-user-사용자)                      | 4         | 사용자 및 권한 관리   |
| [Employee](#2-employee-직원)                | 5         | 직원 정보 관리        |
| [Payroll](#3-payroll-급여)                  | 4         | 급여 계산 및 지급     |
| [Budget](#4-budget-예산)                    | 4         | 예산 관리 및 집행     |
| [Attendance](#5-attendance-근태)            | 4         | 출퇴근 및 휴가 관리   |
| [Asset](#6-asset-자산)                      | 4         | 자산 등록 및 배정     |
| [Supply](#7-supply-물품)                    | 4         | 물품 요청 및 출고     |
| [Accounting](#8-accounting-회계)            | 4         | 회계 전표 및 결산     |
| [Approval](#9-approval-결재)                | 5         | 전자결재 프로세스     |
| [Notification](#10-notification-알림)       | 4         | 알림 및 메시징        |
| [File](#11-file-파일)                       | 4         | 파일 관리             |
| [Report](#12-report-보고서)                 | 4         | 보고서 생성 및 관리   |
| [General Affairs](#13-general-affairs-총무) | 6         | 시설, 차량, 민원 관리 |
| [System](#14-system-시스템)                 | 6         | 시스템 및 테넌트 관리 |
| **총계**                                    | **61**    |                       |

---

## 이벤트 스키마 상세

### 1. User (사용자)

#### 1.1 user.created

**설명**: 새로운 사용자가 시스템에 등록되었을 때 발행

**데이터 구조**:

```typescript
{
  userId: number;
  username: string;
  email: string;
  roleIds: number[];
}
```

**발행 시점**: 사용자 등록 완료 직후  
**주요 구독자**: notification-service (가입 환영 메일), audit-service

#### 1.2 user.updated

**설명**: 사용자 정보가 수정되었을 때 발행

**데이터 구조**:

```typescript
{
  userId: number;
  updatedFields: string[]; // 변경된 필드 목록
}
```

#### 1.3 user.deleted

**설명**: 사용자가 삭제되었을 때 발행

**데이터 구조**:

```typescript
{
  userId: number;
}
```

#### 1.4 user.role.changed

**설명**: 사용자의 권한이 변경되었을 때 발행

**데이터 구조**:

```typescript
{
  userId: number;
  oldRoleIds: number[];
  newRoleIds: number[];
}
```

---

### 2. Employee (직원)

#### 2.1 employee.created

**설명**: 새로운 직원이 등록되었을 때 발행

**데이터 구조**:

```typescript
{
  employeeId: number;
  employeeNumber: string;
  name: string;
  email: string;
  departmentId: number;
  positionId: number;
  hireDate: Date;
}
```

**주요 구독자**:

- payroll-service (급여 계산용 직원 정보 캐시)
- asset-service (PC 할당 알림)
- attendance-service (출퇴근 기록 준비)

#### 2.2 employee.updated

**데이터 구조**:

```typescript
{
  employeeId: number;
  updatedFields: string[];
  previousDepartmentId?: number;
  newDepartmentId?: number;
}
```

#### 2.3 employee.terminated

**설명**: 직원이 퇴사했을 때 발행

**데이터 구조**:

```typescript
{
  employeeId: number;
  terminationDate: Date;
  reason: string;
}
```

#### 2.4 employee.department.changed

**데이터 구조**:

```typescript
{
  employeeId: number;
  oldDepartmentId: number;
  newDepartmentId: number;
  effectiveDate: Date;
}
```

#### 2.5 employee.position.changed

**데이터 구조**:

```typescript
{
  employeeId: number;
  oldPositionId: number;
  newPositionId: number;
  effectiveDate: Date;
}
```

---

### 3. Payroll (급여)

#### 3.1 payroll.calculated

**설명**: 급여 계산이 완료되었을 때 발행

**데이터 구조**:

```typescript
{
  payrollId: number;
  employeeId: number;
  yearMonth: string; // YYYY-MM
  totalAmount: number;
}
```

#### 3.2 payroll.approved

**데이터 구조**:

```typescript
{
  payrollId: number;
  employeeId: number;
  yearMonth: string;
  approvedBy: number;
  approvedAt: Date;
}
```

#### 3.3 payroll.paid

**데이터 구조**:

```typescript
{
  payrollId: number;
  employeeId: number;
  yearMonth: string;
  totalAmount: number;
  paidAt: Date;
}
```

#### 3.4 payroll.item.changed

**데이터 구조**:

```typescript
{
  payrollId: number;
  employeeId: number;
  changedItems: Array<{
    itemCode: string;
    itemName: string;
    oldAmount: number;
    newAmount: number;
  }>;
}
```

---

### 4. Budget (예산)

#### 4.1 budget.created

**데이터 구조**:

```typescript
{
  budgetId: number;
  year: number;
  departmentId: number;
  totalAmount: number;
}
```

#### 4.2 budget.approved

**데이터 구조**:

```typescript
{
  budgetId: number;
  approvedBy: number;
  approvedAt: Date;
}
```

#### 4.3 budget.executed

**데이터 구조**:

```typescript
{
  budgetId: number;
  executionId: number;
  amount: number;
  remainingAmount: number;
  description: string;
}
```

#### 4.4 budget.exceeded

**설명**: 예산이 초과되었을 때 발행 (알림용)

**데이터 구조**:

```typescript
{
  budgetId: number;
  departmentId: number;
  budgetAmount: number;
  executedAmount: number;
  exceededAmount: number;
}
```

---

### 5. Attendance (근태)

#### 5.1 attendance.recorded

**데이터 구조**:

```typescript
{
  attendanceId: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT';
}
```

#### 5.2 leave.requested

**데이터 구조**:

```typescript
{
  leaveId: number;
  employeeId: number;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  days: number;
}
```

#### 5.3 leave.approved

**데이터 구조**:

```typescript
{
  leaveId: number;
  employeeId: number;
  approvedBy: number;
  approvedAt: Date;
}
```

#### 5.4 leave.rejected

**데이터 구조**:

```typescript
{
  leaveId: number;
  employeeId: number;
  rejectedBy: number;
  rejectedAt: Date;
  reason: string;
}
```

---

### 6. Asset (자산)

#### 6.1 asset.registered

**데이터 구조**:

```typescript
{
  assetId: number;
  assetNumber: string;
  name: string;
  categoryId: number;
  acquisitionAmount: number;
  acquisitionDate: Date;
}
```

#### 6.2 asset.assigned

**데이터 구조**:

```typescript
{
  assetId: number;
  employeeId: number;
  departmentId: number;
  assignedAt: Date;
}
```

#### 6.3 asset.returned

**데이터 구조**:

```typescript
{
  assetId: number;
  employeeId: number;
  returnedAt: Date;
}
```

#### 6.4 asset.disposed

**데이터 구조**:

```typescript
{
  assetId: number;
  disposalDate: Date;
  disposalReason: string;
  disposalAmount: number;
}
```

---

### 7. Supply (물품)

#### 7.1 supply.requested

**데이터 구조**:

```typescript
{
  requestId: number;
  employeeId: number;
  departmentId: number;
  items: Array<{
    itemId: number;
    itemName: string;
    quantity: number;
  }>;
}
```

#### 7.2 supply.request.approved

**데이터 구조**:

```typescript
{
  requestId: number;
  approvedBy: number;
  approvedAt: Date;
}
```

#### 7.3 supply.issued

**데이터 구조**:

```typescript
{
  issueId: number;
  requestId: number;
  items: Array<{
    itemId: number;
    quantity: number;
  }>;
  issuedAt: Date;
}
```

#### 7.4 supply.low.stock

**설명**: 재고가 부족할 때 발행 (알림용)

**데이터 구조**:

```typescript
{
  itemId: number;
  itemName: string;
  currentStock: number;
  minimumStock: number;
}
```

---

### 8. Accounting (회계)

#### 8.1 voucher.created

**데이터 구조**:

```typescript
{
  voucherId: number;
  voucherNumber: string;
  voucherDate: Date;
  totalDebitAmount: number;
  totalCreditAmount: number;
}
```

#### 8.2 voucher.approved

**데이터 구조**:

```typescript
{
  voucherId: number;
  approvedBy: number;
  approvedAt: Date;
}
```

#### 8.3 settlement.completed

**데이터 구조**:

```typescript
{
  settlementId: number;
  year: number;
  month: number;
  completedAt: Date;
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
}
```

#### 8.4 account.changed

**데이터 구조**:

```typescript
{
  accountId: number;
  accountCode: string;
  accountName: string;
  changedFields: string[];
}
```

---

### 9. Approval (결재)

#### 9.1 approval.requested

**데이터 구조**:

```typescript
{
  approvalId: number;
  documentType: string;
  documentId: number;
  requesterId: number;
  approverIds: number[];
  title: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH';
}
```

#### 9.2 approval.approved

**데이터 구조**:

```typescript
{
  approvalId: number;
  documentType: string;
  documentId: number;
  approverId: number;
  approvedAt: Date;
  comment?: string;
}
```

#### 9.3 approval.rejected

**데이터 구조**:

```typescript
{
  approvalId: number;
  documentType: string;
  documentId: number;
  rejectedBy: number;
  rejectedAt: Date;
  reason: string;
}
```

#### 9.4 approval.cancelled

**데이터 구조**:

```typescript
{
  approvalId: number;
  documentType: string;
  documentId: number;
  cancelledBy: number;
  cancelledAt: Date;
  reason: string;
}
```

#### 9.5 approval.line.changed

**데이터 구조**:

```typescript
{
  approvalId: number;
  oldApproverIds: number[];
  newApproverIds: number[];
  changedBy: number;
}
```

---

### 10. Notification (알림)

#### 10.1 notification.sent

**데이터 구조**:

```typescript
{
  notificationId: number;
  recipientIds: number[];
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
}
```

#### 10.2 notification.read

**데이터 구조**:

```typescript
{
  notificationId: number;
  readBy: number;
  readAt: Date;
}
```

#### 10.3 email.sent

**데이터 구조**:

```typescript
{
  emailId: number;
  to: string[];
  cc?: string[];
  subject: string;
  sentAt: Date;
  status: 'SENT' | 'FAILED';
}
```

#### 10.4 sms.sent

**데이터 구조**:

```typescript
{
  smsId: number;
  phoneNumbers: string[];
  message: string;
  sentAt: Date;
  status: 'SENT' | 'FAILED';
}
```

---

### 11. File (파일)

#### 11.1 file.uploaded

**데이터 구조**:

```typescript
{
  fileId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: Date;
  category: string;
  relatedEntity?: {
    entityType: string;
    entityId: number;
  };
}
```

#### 11.2 file.downloaded

**데이터 구조**:

```typescript
{
  fileId: number;
  downloadedBy: number;
  downloadedAt: Date;
}
```

#### 11.3 file.deleted

**데이터 구조**:

```typescript
{
  fileId: number;
  fileName: string;
  deletedBy: number;
  deletedAt: Date;
}
```

#### 11.4 file.scan.completed

**데이터 구조**:

```typescript
{
  fileId: number;
  scanResult: 'CLEAN' | 'INFECTED' | 'SUSPICIOUS';
  scannedAt: Date;
  details?: string;
}
```

---

### 12. Report (보고서)

#### 12.1 report.generation.requested

**데이터 구조**:

```typescript
{
  reportId: number;
  reportType: string;
  requestedBy: number;
  parameters: Record<string, unknown>;
  format: 'PDF' | 'EXCEL' | 'CSV';
}
```

#### 12.2 report.generated

**데이터 구조**:

```typescript
{
  reportId: number;
  reportType: string;
  fileId: number;
  generatedAt: Date;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}
```

#### 12.3 report.viewed

**데이터 구조**:

```typescript
{
  reportId: number;
  viewedBy: number;
  viewedAt: Date;
}
```

#### 12.4 report.schedule.created

**데이터 구조**:

```typescript
{
  scheduleId: number;
  reportType: string;
  cronExpression: string;
  recipients: number[];
  createdBy: number;
}
```

---

### 13. General Affairs (총무)

#### 13.1 facility.reserved

**데이터 구조**:

```typescript
{
  reservationId: number;
  facilityId: number;
  facilityName: string;
  reservedBy: number;
  startTime: Date;
  endTime: Date;
  purpose: string;
}
```

#### 13.2 facility.reservation.cancelled

**데이터 구조**:

```typescript
{
  reservationId: number;
  facilityId: number;
  cancelledBy: number;
  cancelledAt: Date;
  reason: string;
}
```

#### 13.3 vehicle.dispatched

**데이터 구조**:

```typescript
{
  dispatchId: number;
  vehicleId: number;
  vehicleNumber: string;
  driverId: number;
  requesterId: number;
  departureTime: Date;
  destination: string;
  purpose: string;
}
```

#### 13.4 vehicle.returned

**데이터 구조**:

```typescript
{
  dispatchId: number;
  vehicleId: number;
  returnedAt: Date;
  mileage: number;
  fuelUsed: number;
}
```

#### 13.5 complaint.received

**데이터 구조**:

```typescript
{
  complaintId: number;
  category: string;
  title: string;
  submittedBy: number;
  submittedAt: Date;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}
```

#### 13.6 complaint.resolved

**데이터 구조**:

```typescript
{
  complaintId: number;
  resolvedBy: number;
  resolvedAt: Date;
  resolution: string;
}
```

---

### 14. System (시스템)

#### 14.1 tenant.created

**데이터 구조**:

```typescript
{
  tenantId: number;
  tenantCode: string;
  tenantName: string;
  createdAt: Date;
  subscriptionPlan: string;
}
```

#### 14.2 tenant.settings.updated

**데이터 구조**:

```typescript
{
  tenantId: number;
  updatedSettings: string[];
  updatedBy: number;
}
```

#### 14.3 tenant.suspended

**데이터 구조**:

```typescript
{
  tenantId: number;
  suspendedBy: number;
  suspendedAt: Date;
  reason: string;
}
```

#### 14.4 tenant.activated

**데이터 구조**:

```typescript
{
  tenantId: number;
  activatedBy: number;
  activatedAt: Date;
}
```

#### 14.5 system.config.updated

**데이터 구조**:

```typescript
{
  configKey: string;
  oldValue: string;
  newValue: string;
  updatedBy: number;
}
```

#### 14.6 common.code.updated

**데이터 구조**:

```typescript
{
  codeGroupId: number;
  codeId: number;
  codeValue: string;
  codeName: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
}
```

---

## 사용 가이드

### TypeScript Import

```typescript
import { EventType, EmployeeCreatedEvent, EventEmitterService } from '@all-erp/shared/events';
```

### 이벤트 발행 예제

```typescript
await this.eventEmitter.emit<EmployeeCreatedEvent>(EventType.EMPLOYEE_CREATED, {
  tenantId: 1,
  userId: 100,
  data: {
    employeeId: 1,
    employeeNumber: 'EMP001',
    name: '홍길동',
    email: 'hong@example.com',
    departmentId: 10,
    positionId: 5,
    hireDate: new Date('2024-01-01'),
  },
});
```

### 이벤트 수신 예제

```typescript
@EventPattern(EventType.EMPLOYEE_CREATED)
async handleEmployeeCreated(@Payload() event: EmployeeCreatedEvent) {
  console.log(`Received: ${event.eventType}`);
  await this.processEmployee(event.data);
}
```

---

## 부록

### 이벤트 타입 그룹

`EventTypeGroups` 객체를 사용하여 도메인별 이벤트를 그룹화할 수 있습니다:

```typescript
import { EventTypeGroups } from '@all-erp/shared/events';

// 직원 관련 모든 이벤트 구독
EventTypeGroups.EMPLOYEE.forEach((eventType) => {
  // 구독 로직
});
```

### BaseEvent 구조

모든 이벤트는 다음 필드를 포함합니다:

```typescript
interface BaseEvent {
  eventId: string; // UUID
  eventType: string; // 이벤트 타입
  timestamp: Date; // 발생 시각
  tenantId: number; // 테넌트 ID
  userId?: number; // 발행자 ID
  correlationId?: string; // 추적 ID
}
```

---

**문서 버전**: 1.0  
**담당**: Development Team  
**라이선스**: Internal Use Only
