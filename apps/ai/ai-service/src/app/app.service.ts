import { Injectable } from '@nestjs/common';

/**
 * AI Service 기본 비즈니스 로직 처리
 */
@Injectable()
export class AppService {
  /**
   * 기본 데이터 반환
   * @returns 환영 메시지
   */
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
