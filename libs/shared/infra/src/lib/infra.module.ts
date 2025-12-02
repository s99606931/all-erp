import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

/**
 * 공통 인프라 모듈
 * 
 * 모든 마이크로서비스에서 사용되는 인프라 관련 모듈을 통합합니다.
 * - PrismaModule: 데이터베이스 연결
 * - LoggerModule: 구조화된 로깅
 * - RabbitMQModule: 메시지 큐 (서비스 간 통신)
 * 
 * 사용법:
 * ```typescript
 * @Module({
 *   imports: [InfraModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [PrismaModule, LoggerModule, RabbitMQModule],
  exports: [PrismaModule, LoggerModule, RabbitMQModule],
})
export class InfraModule {}

