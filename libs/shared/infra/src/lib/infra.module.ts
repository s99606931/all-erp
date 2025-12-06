import { Module, Global } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EventModule } from './event/event.module';

/**
 * 공통 인프라 모듈
 * 
 * Database per Service 패턴에 따라 PrismaModule은 제거되었습니다.
 * 각 마이크로서비스는 자체 PrismaModule을 구현해야 합니다.
 * 
 * 포함되는 모듈:
 * - LoggerModule: winston 기반 로깅
 * - RabbitMQModule: 이벤트 기반 통신
 * - EventModule: 이벤트 발행/구독
 */
@Global()
@Module({
  imports: [
    LoggerModule,
    RabbitMQModule,
    EventModule,
  ],
  exports: [
    LoggerModule,
    RabbitMQModule,
    EventModule,
  ],
})
export class SharedInfraModule {}

export * from './interceptors/logging.interceptor';
export * from './filters/http-exception.filter';
