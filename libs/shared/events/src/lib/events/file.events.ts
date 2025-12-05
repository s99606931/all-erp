import { BaseEvent } from '../base-event.interface';

/**
 * 파일 업로드 이벤트
 */
export interface FileUploadedEvent extends BaseEvent {
  eventType: 'file.uploaded';
  data: {
    fileId: number;
    fileName: string;
    fileSize: number; // bytes
    mimeType: string;
    uploadedBy: number;
    uploadedAt: Date;
    category: string; // 파일 카테고리 (예: 'DOCUMENT', 'IMAGE', 'REPORT')
    relatedEntity?: {
      entityType: string; // 연관 엔티티 타입 (예: 'EMPLOYEE', 'BUDGET')
      entityId: number;
    };
  };
}

/**
 * 파일 다운로드 이벤트
 */
export interface FileDownloadedEvent extends BaseEvent {
  eventType: 'file.downloaded';
  data: {
    fileId: number;
    downloadedBy: number;
    downloadedAt: Date;
  };
}

/**
 * 파일 삭제 이벤트
 */
export interface FileDeletedEvent extends BaseEvent {
  eventType: 'file.deleted';
  data: {
    fileId: number;
    fileName: string;
    deletedBy: number;
    deletedAt: Date;
  };
}

/**
 * 파일 스캔 완료 이벤트 (바이러스 검사)
 */
export interface FileScanCompletedEvent extends BaseEvent {
  eventType: 'file.scan.completed';
  data: {
    fileId: number;
    scanResult: 'CLEAN' | 'INFECTED' | 'SUSPICIOUS';
    scannedAt: Date;
    details?: string;
  };
}
