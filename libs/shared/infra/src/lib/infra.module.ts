import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

/**
 * 공통 인프라 모듈
 * 
 * 모든 마이크로서비스에서 사용되는 인프라 관련 모듈을 통합합니다.
 * - PrismaModule: 데이터베이스 연결
 * Prisma, Logger, RabbitMQ 등 인프라 관련 모듈을 통합 제공
 */
@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    RabbitMQModule,
  ],
  exports: [
    PrismaModule,
    LoggerModule,
    RabbitMQModule,
  ],
})
export class SharedInfraModule {}
