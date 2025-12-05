import { Injectable } from '@nestjs/common';

/**
 * 애플리케이션 서비스
 */
@Injectable()
export class AppService {
  /**
   * 서비스 헬스체크
   * @returns 서비스 상태 정보
   */
  getHealth() {
    return {
      service: 'report-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
