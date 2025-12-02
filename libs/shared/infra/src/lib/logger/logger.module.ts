import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from './logger.service';

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
    WinstonModule.forRoot({
      level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: process.env['SERVICE_NAME'] || 'all-erp' },
      transports: [
        // 콘솔 출력
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, service, ...meta }): string => {
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
            })
          ),
        }),
        // 에러 로그 파일 (운영 환경)
        ...(process.env['NODE_ENV'] === 'production'
          ? [
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
              new winston.transports.File({
                filename: 'logs/combined.log',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
            ]
          : []),
      ],
    }),
  ],
  providers: [LoggerService],
  exports: [WinstonModule, LoggerService],
})
export class LoggerModule {}
