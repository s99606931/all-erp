import { Module, Global } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EventModule } from './event/event.module';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthController } from './health/health.controller';

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
 * - TerminusModule: 헬스 체크
 * - PrometheusModule: 메트릭 수집
 */
@Global()
@Module({
  imports: [
    LoggerModule,
    RabbitMQModule,
    EventModule,
    TerminusModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [HealthController],
  exports: [
    LoggerModule,
    RabbitMQModule,
    EventModule,
    TerminusModule,
    PrometheusModule,
  ],
})
export class SharedInfraModule {}

export * from './interceptors/logging.interceptor';
export * from './filters/http-exception.filter';
