import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

/**
 * 커스텀 로거 서비스
 * 
 * Winston을 래핑하여 보다 간편한 로깅 인터페이스를 제공합니다.
 * - 컨텍스트 기반 로깅 (서비스명, 요청 ID 등)
 * - 구조화된 메타데이터 지원
 * - NestJS Logger 인터페이스와 호환
 */
@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger
  ) {}

  /**
   * 디버그 레벨 로그
   * @param message 로그 메시지
   * @param context 컨텍스트 (서비스명, 클래스명 등)
   * @param meta 추가 메타데이터
   */
  debug(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context, ...meta });
  }

  /**
   * 정보 레벨 로그
   * @param message 로그 메시지
   * @param context 컨텍스트 (서비스명, 클래스명 등)
   * @param meta 추가 메타데이터
   */
  log(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context, ...meta });
  }

  /**
   * 경고 레벨 로그
   * @param message 로그 메시지
   * @param context 컨텍스트 (서비스명, 클래스명 등)
   * @param meta 추가 메타데이터
   */
  warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context, ...meta });
  }

  /**
   * 에러 레벨 로그
   * @param message 로그 메시지
   * @param trace 스택 트레이스
   * @param context 컨텍스트 (서비스명, 클래스명 등)
   * @param meta 추가 메타데이터
   */
  error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, { trace, context, ...meta });
  }

  /**
   * HTTP 요청 로그
   * @param method HTTP 메서드 (GET, POST 등)
   * @param url 요청 URL
   * @param statusCode 응답 상태 코드
   * @param responseTime 응답 시간 (ms)
   * @param meta 추가 메타데이터
   */
  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    meta?: Record<string, unknown>
  ): void {
    this.logger.info(`${method} ${url} ${statusCode} ${responseTime}ms`, {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime,
      ...meta,
    });
  }
}
