import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { LoggerService } from './logger.service';
import { winstonConfig } from './winston.config';

/**
 * Winston 기반 로깅 모듈
 * 
 * 애플리케이션 전체에서 사용되는 구조화된 로깅을 제공합니다.
 * - JSON 포맷 로깅 (구조화된 데이터)
 * - 환경별 로그 레벨 (개발: debug, 운영: info)
 * - 콘솔 출력 + 파일 저장
 * - 타임스탬프 및 실행 시간 추적
 */
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [LoggerService],
  exports: [WinstonModule, LoggerService],
})
export class LoggerModule {}
