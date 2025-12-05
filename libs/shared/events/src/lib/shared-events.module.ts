import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventEmitterService } from './event-emitter.service';

/**
 * 공통 이벤트 모듈
 * 
 * RabbitMQ를 통한 이벤트 기반 통신을 위한 공통 모듈입니다.
 * @Global 데코레이터로 전역 모듈로 선언하여 모든 서비스에서 사용 가능합니다.
 */
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672',
          ],
          queue: 'events_queue',
          queueOptions: {
            durable: true, // 서버 재시작 시에도 큐 유지
          },
        },
      },
    ]),
  ],
  providers: [EventEmitterService],
  exports: [EventEmitterService, ClientsModule],
})
export class SharedEventsModule {}
