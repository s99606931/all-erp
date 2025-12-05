import { BaseEvent } from '../base-event.interface';

/**
 * 보고서 생성 요청 이벤트
 */
export interface ReportGenerationRequestedEvent extends BaseEvent {
  eventType: 'report.generation.requested';
  data: {
    reportId: number;
    reportType: string; // 보고서 타입 (예: 'PAYROLL_SUMMARY', 'BUDGET_REPORT')
    requestedBy: number;
    parameters: Record<string, unknown>; // 보고서 파라미터
    format: 'PDF' | 'EXCEL' | 'CSV';
  };
}

/**
 * 보고서 생성 완료 이벤트
 */
export interface ReportGeneratedEvent extends BaseEvent {
  eventType: 'report.generated';
  data: {
    reportId: number;
    reportType: string;
    fileId: number; // 생성된 파일 ID
    generatedAt: Date;
    status: 'SUCCESS' | 'FAILED';
    errorMessage?: string;
  };
}

/**
 * 보고서 조회 이벤트
 */
export interface ReportViewedEvent extends BaseEvent {
  eventType: 'report.viewed';
  data: {
    reportId: number;
    viewedBy: number;
    viewedAt: Date;
  };
}

/**
 * 정기 보고서 스케줄 등록 이벤트
 */
export interface ReportScheduleCreatedEvent extends BaseEvent {
  eventType: 'report.schedule.created';
  data: {
    scheduleId: number;
    reportType: string;
    cronExpression: string; // cron 표현식
    recipients: number[]; // 보고서 수신자
    createdBy: number;
  };
}
