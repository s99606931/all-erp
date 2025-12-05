import { BaseEvent } from '../base-event.interface';

/**
 * 테넌트 생성 이벤트
 */
export interface TenantCreatedEvent extends BaseEvent {
  eventType: 'tenant.created';
  data: {
    tenantId: number;
    tenantCode: string;
    tenantName: string;
    createdAt: Date;
    subscriptionPlan: string;
  };
}

/**
 * 테넌트 설정 변경 이벤트
 */
export interface TenantSettingsUpdatedEvent extends BaseEvent {
  eventType: 'tenant.settings.updated';
  data: {
    tenantId: number;
    updatedSettings: string[]; // 변경된 설정 목록
    updatedBy: number;
  };
}

/**
 * 테넌트 일시정지 이벤트
 */
export interface TenantSuspendedEvent extends BaseEvent {
  eventType: 'tenant.suspended';
  data: {
    tenantId: number;
    suspendedBy: number;
    suspendedAt: Date;
    reason: string;
  };
}

/**
 * 테넌트 활성화 이벤트
 */
export interface TenantActivatedEvent extends BaseEvent {
  eventType: 'tenant.activated';
  data: {
    tenantId: number;
    activatedBy: number;
    activatedAt: Date;
  };
}

/**
 * 시스템 설정 변경 이벤트
 */
export interface SystemConfigUpdatedEvent extends BaseEvent {
  eventType: 'system.config.updated';
  data: {
    configKey: string;
    oldValue: string;
    newValue: string;
    updatedBy: number;
  };
}

/**
 * 공통코드 변경 이벤트
 */
export interface CommonCodeUpdatedEvent extends BaseEvent {
  eventType: 'common.code.updated';
  data: {
    codeGroupId: number;
    codeId: number;
    codeValue: string;
    codeName: string;
    action: 'CREATED' | 'UPDATED' | 'DELETED';
  };
}
