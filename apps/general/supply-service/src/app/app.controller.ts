import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * 애플리케이션의 기본 컨트롤러
 * 헬스 체크 및 기본 정보 조회를 담당합니다.
 */
@ApiTags('기본')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 기본 데이터 조회
   * @returns 기본 메시지 객체
   */
  @Get()
  @ApiOperation({ summary: '기본 데이터 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  getData() {
    return this.appService.getData();
  }

  /**
   * 서비스 상태 확인 (Health Check)
   * 로드 밸런서나 모니터링 시스템에서 서비스 생존 여부를 확인할 때 사용합니다.
   * @returns 서비스 상태 및 서비스명
   */
  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: '서비스 정상' })
  health() {
    return { status: 'ok', service: 'supply-service' };
  }
}
