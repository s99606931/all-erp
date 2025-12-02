import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * AI Service 기본 API 컨트롤러
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 기본 데이터 조회
   * @returns 환영 메시지
   */
  @Get()
  getData() {
    return this.appService.getData();
  }
}
