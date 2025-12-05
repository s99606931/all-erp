import { BaseEvent } from '../base-event.interface';

/**
 * 직원 생성 이벤트
 */
export interface EmployeeCreatedEvent extends BaseEvent {
  eventType: 'employee.created';
  data: {
    employeeId: number;
    employeeNumber: string;
    name: string;
    email: string;
    departmentId: number;
    positionId: number;
    hireDate: Date;
  };
}

/**
 * 직원 정보 업데이트 이벤트
 */
export interface EmployeeUpdatedEvent extends BaseEvent {
  eventType: 'employee.updated';
  data: {
    employeeId: number;
    updatedFields: string[]; // 변경된 필드 목록
    previousDepartmentId?: number; // 부서 변경 시
    newDepartmentId?: number;
  };
}

/**
 * 직원 퇴사 이벤트
 */
export interface EmployeeTerminatedEvent extends BaseEvent {
  eventType: 'employee.terminated';
  data: {
    employeeId: number;
    terminationDate: Date;
    reason: string;
  };
}

/**
 * 직원 부서 이동 이벤트
 */
export interface EmployeeDepartmentChangedEvent extends BaseEvent {
  eventType: 'employee.department.changed';
  data: {
    employeeId: number;
    oldDepartmentId: number;
    newDepartmentId: number;
    effectiveDate: Date;
  };
}

/**
 * 직원 직급 변경 이벤트
 */
export interface EmployeePositionChangedEvent extends BaseEvent {
  eventType: 'employee.position.changed';
  data: {
    employeeId: number;
    oldPositionId: number;
    newPositionId: number;
    effectiveDate: Date;
  };
}
