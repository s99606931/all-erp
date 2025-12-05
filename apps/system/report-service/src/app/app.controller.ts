import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * 애플리케이션 헬스체크 컨트롤러
 */
@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 서비스 헬스체크
   * @returns 서비스 상태 정보
   */
  @Get()
  @ApiOperation({ summary: '서비스 헬스체크' })
  getHealth() {
    return this.appService.getHealth();
  }
}
