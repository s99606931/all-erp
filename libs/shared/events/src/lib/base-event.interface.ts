/**
 * 모든 이벤트의 기본 인터페이스
 * 
 * 모든 도메인 이벤트는 이 인터페이스를 확장하여 사용해야 합니다.
 * 멀티테넌시, 추적성, 멱등성을 보장하기 위한 필수 필드를 포함합니다.
 */
export interface BaseEvent {
  /** 이벤트 고유 ID (UUID) - 멱등성 보장을 위해 사용 */
  eventId: string;

  /** 이벤트 타입 (예: 'employee.created', 'payroll.calculated') */
  eventType: string;

  /** 이벤트 발생 시각 */
  timestamp: Date;

  /** 테넌트 ID (멀티테넌시 지원) */
  tenantId: number;

  /** 이벤트를 발생시킨 사용자 ID (선택사항) */
  userId?: number;

  /** 요청 추적을 위한 상관관계 ID (선택사항) */
  correlationId?: string;
}
