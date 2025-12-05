import { BaseEvent } from '../base-event.interface';

/**
 * 사용자 생성 이벤트
 */
export interface UserCreatedEvent extends BaseEvent {
  eventType: 'user.created';
  data: {
    userId: number;
    username: string;
    email: string;
    roleIds: number[];
  };
}

/**
 * 사용자 업데이트 이벤트
 */
export interface UserUpdatedEvent extends BaseEvent {
  eventType: 'user.updated';
  data: {
    userId: number;
    updatedFields: string[]; // 변경된 필드 목록
  };
}

/**
 * 사용자 삭제 이벤트
 */
export interface UserDeletedEvent extends BaseEvent {
  eventType: 'user.deleted';
  data: {
    userId: number;
  };
}

/**
 * 사용자 권한 변경 이벤트
 */
export interface UserRoleChangedEvent extends BaseEvent {
  eventType: 'user.role.changed';
  data: {
    userId: number;
    oldRoleIds: number[];
    newRoleIds: number[];
  };
}
