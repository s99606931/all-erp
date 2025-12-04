# TASK-P3-02: 이벤트 스키마 정의

## 📋 작업 개요
- **Phase**: Phase 3 (서비스 간 통신 구현)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P3-01

## 🎯 목표

시스템 전체에서 사용할 모든 도메인 이벤트 스키마를 정의합니다.

## 📝 상세작업 내용

### 1. 이벤트 타입 정의

**libs/shared/events/src/lib/event-types.ts**:
```typescript
export enum EventType {
  // Auth
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  
  // Personnel
  EMPLOYEE_CREATED = 'employee.created',
  EMPLOYEE_UPDATED = 'employee.updated',
  EMPLOYEE_TERMINATED = 'employee.terminated',
  
  // Payroll
  PAYROLL_SUBMITTED = 'payroll.submitted',
  PAYROLL_APPROVED = 'payroll.approved',
  SALARY_PAID = 'salary.paid',
  
  // Budget
  BUDGET_CREATED = 'budget.created',
  BUDGET_APPROVED = 'budget.approved',
  BUDGET_EXCEEDED = 'budget.exceeded',
  
  // Approval
  APPROVAL_REQUESTED = 'approval.requested',
  APPROVAL_APPROVED = 'approval.approved',
  APPROVAL_REJECTED = 'approval.rejected',
  
  // Notification
  NOTIFICATION_SENT = 'notification.sent',
  
  // File
  FILE_UPLOADED = 'file.uploaded',
  FILE_DELETED = 'file.deleted',
}
```

## ✅ 완료 조건

- [ ] 50개 이상의 이벤트 타입 정의
- [ ] TypeScript 인터페이스 작성
- [ ] 문서화 (`docs/architecture/events-catalog.md`)

## 🔧 실행 명령어

```bash
cd libs/shared/events
pnpm build
```
