/**
 * 시스템 전체에서 사용하는 이벤트 타입 정의
 * 
 * 모든 이벤트는 '{domain}.{action}' 형식을 따릅니다.
 * 예: 'employee.created', 'payroll.approved'
 */
export enum EventType {
  // ========================================
  // User Domain (사용자)
  // ========================================
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_ROLE_CHANGED = 'user.role.changed',

  // ========================================
  // Employee Domain (직원)
  // ========================================
  EMPLOYEE_CREATED = 'employee.created',
  EMPLOYEE_UPDATED = 'employee.updated',
  EMPLOYEE_TERMINATED = 'employee.terminated',
  EMPLOYEE_DEPARTMENT_CHANGED = 'employee.department.changed',
  EMPLOYEE_POSITION_CHANGED = 'employee.position.changed',

  // ========================================
  // Payroll Domain (급여)
  // ========================================
  PAYROLL_CALCULATED = 'payroll.calculated',
  PAYROLL_APPROVED = 'payroll.approved',
  PAYROLL_PAID = 'payroll.paid',
  PAYROLL_ITEM_CHANGED = 'payroll.item.changed',

  // ========================================
  // Budget Domain (예산)
  // ========================================
  BUDGET_CREATED = 'budget.created',
  BUDGET_APPROVED = 'budget.approved',
  BUDGET_EXECUTED = 'budget.executed',
  BUDGET_EXCEEDED = 'budget.exceeded',

  // ========================================
  // Attendance Domain (근태)
  // ========================================
  ATTENDANCE_RECORDED = 'attendance.recorded',
  LEAVE_REQUESTED = 'leave.requested',
  LEAVE_APPROVED = 'leave.approved',
  LEAVE_REJECTED = 'leave.rejected',

  // ========================================
  // Asset Domain (자산)
  // ========================================
  ASSET_REGISTERED = 'asset.registered',
  ASSET_ASSIGNED = 'asset.assigned',
  ASSET_RETURNED = 'asset.returned',
  ASSET_DISPOSED = 'asset.disposed',

  // ========================================
  // Supply Domain (물품)
  // ========================================
  SUPPLY_REQUESTED = 'supply.requested',
  SUPPLY_REQUEST_APPROVED = 'supply.request.approved',
  SUPPLY_ISSUED = 'supply.issued',
  SUPPLY_LOW_STOCK = 'supply.low.stock',

  // ========================================
  // Accounting Domain (회계)
  // ========================================
  VOUCHER_CREATED = 'voucher.created',
  VOUCHER_APPROVED = 'voucher.approved',
  SETTLEMENT_COMPLETED = 'settlement.completed',
  ACCOUNT_CHANGED = 'account.changed',

  // ========================================
  // Approval Domain (결재)
  // ========================================
  APPROVAL_REQUESTED = 'approval.requested',
  APPROVAL_APPROVED = 'approval.approved',
  APPROVAL_REJECTED = 'approval.rejected',
  APPROVAL_CANCELLED = 'approval.cancelled',
  APPROVAL_LINE_CHANGED = 'approval.line.changed',

  // ========================================
  // Notification Domain (알림)
  // ========================================
  NOTIFICATION_SENT = 'notification.sent',
  NOTIFICATION_READ = 'notification.read',
  EMAIL_SENT = 'email.sent',
  SMS_SENT = 'sms.sent',

  // ========================================
  // File Domain (파일)
  // ========================================
  FILE_UPLOADED = 'file.uploaded',
  FILE_DOWNLOADED = 'file.downloaded',
  FILE_DELETED = 'file.deleted',
  FILE_SCAN_COMPLETED = 'file.scan.completed',

  // ========================================
  // Report Domain (보고서)
  // ========================================
  REPORT_GENERATION_REQUESTED = 'report.generation.requested',
  REPORT_GENERATED = 'report.generated',
  REPORT_VIEWED = 'report.viewed',
  REPORT_SCHEDULE_CREATED = 'report.schedule.created',

  // ========================================
  // General Affairs Domain (총무)
  // ========================================
  FACILITY_RESERVED = 'facility.reserved',
  FACILITY_RESERVATION_CANCELLED = 'facility.reservation.cancelled',
  VEHICLE_DISPATCHED = 'vehicle.dispatched',
  VEHICLE_RETURNED = 'vehicle.returned',
  COMPLAINT_RECEIVED = 'complaint.received',
  COMPLAINT_RESOLVED = 'complaint.resolved',

  // ========================================
  // System/Tenant Domain (시스템/테넌트)
  // ========================================
  TENANT_CREATED = 'tenant.created',
  TENANT_SETTINGS_UPDATED = 'tenant.settings.updated',
  TENANT_SUSPENDED = 'tenant.suspended',
  TENANT_ACTIVATED = 'tenant.activated',
  SYSTEM_CONFIG_UPDATED = 'system.config.updated',
  COMMON_CODE_UPDATED = 'common.code.updated',
}

/**
 * 이벤트 타입 카테고리별 그룹
 */
export const EventTypeGroups = {
  USER: [
    EventType.USER_CREATED,
    EventType.USER_UPDATED,
    EventType.USER_DELETED,
    EventType.USER_ROLE_CHANGED,
  ],
  EMPLOYEE: [
    EventType.EMPLOYEE_CREATED,
    EventType.EMPLOYEE_UPDATED,
    EventType.EMPLOYEE_TERMINATED,
    EventType.EMPLOYEE_DEPARTMENT_CHANGED,
    EventType.EMPLOYEE_POSITION_CHANGED,
  ],
  PAYROLL: [
    EventType.PAYROLL_CALCULATED,
    EventType.PAYROLL_APPROVED,
    EventType.PAYROLL_PAID,
    EventType.PAYROLL_ITEM_CHANGED,
  ],
  BUDGET: [
    EventType.BUDGET_CREATED,
    EventType.BUDGET_APPROVED,
    EventType.BUDGET_EXECUTED,
    EventType.BUDGET_EXCEEDED,
  ],
  ATTENDANCE: [
    EventType.ATTENDANCE_RECORDED,
    EventType.LEAVE_REQUESTED,
    EventType.LEAVE_APPROVED,
    EventType.LEAVE_REJECTED,
  ],
  ASSET: [
    EventType.ASSET_REGISTERED,
    EventType.ASSET_ASSIGNED,
    EventType.ASSET_RETURNED,
    EventType.ASSET_DISPOSED,
  ],
  SUPPLY: [
    EventType.SUPPLY_REQUESTED,
    EventType.SUPPLY_REQUEST_APPROVED,
    EventType.SUPPLY_ISSUED,
    EventType.SUPPLY_LOW_STOCK,
  ],
  ACCOUNTING: [
    EventType.VOUCHER_CREATED,
    EventType.VOUCHER_APPROVED,
    EventType.SETTLEMENT_COMPLETED,
    EventType.ACCOUNT_CHANGED,
  ],
  APPROVAL: [
    EventType.APPROVAL_REQUESTED,
    EventType.APPROVAL_APPROVED,
    EventType.APPROVAL_REJECTED,
    EventType.APPROVAL_CANCELLED,
    EventType.APPROVAL_LINE_CHANGED,
  ],
  NOTIFICATION: [
    EventType.NOTIFICATION_SENT,
    EventType.NOTIFICATION_READ,
    EventType.EMAIL_SENT,
    EventType.SMS_SENT,
  ],
  FILE: [
    EventType.FILE_UPLOADED,
    EventType.FILE_DOWNLOADED,
    EventType.FILE_DELETED,
    EventType.FILE_SCAN_COMPLETED,
  ],
  REPORT: [
    EventType.REPORT_GENERATION_REQUESTED,
    EventType.REPORT_GENERATED,
    EventType.REPORT_VIEWED,
    EventType.REPORT_SCHEDULE_CREATED,
  ],
  GENERAL_AFFAIRS: [
    EventType.FACILITY_RESERVED,
    EventType.FACILITY_RESERVATION_CANCELLED,
    EventType.VEHICLE_DISPATCHED,
    EventType.VEHICLE_RETURNED,
    EventType.COMPLAINT_RECEIVED,
    EventType.COMPLAINT_RESOLVED,
  ],
  SYSTEM: [
    EventType.TENANT_CREATED,
    EventType.TENANT_SETTINGS_UPDATED,
    EventType.TENANT_SUSPENDED,
    EventType.TENANT_ACTIVATED,
    EventType.SYSTEM_CONFIG_UPDATED,
    EventType.COMMON_CODE_UPDATED,
  ],
} as const;

/**
 * 전체 이벤트 타입 개수
 */
export const TOTAL_EVENT_TYPES = Object.keys(EventType).length / 2; // enum은 양방향 매핑이라 2로 나눔
