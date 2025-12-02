import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';

/**
 * RabbitMQ 모듈
 * 
 * 마이크로서비스 간 비동기 메시지 통신을 위한 RabbitMQ 연결을 관리합니다.
 * - 자동 연결/재연결
 * - 메시지 발행(publish) 기능
 * - 메시지 구독(subscribe) 기능
 * - 에러 처리 및 로깅
 * 
 * 전역 모듈로 설정되어 애플리케이션 전체에서 사용할 수 있습니다.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
