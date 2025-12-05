import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { BaseEvent } from './base-event.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * RabbitMQ를 통한 이벤트 발행 서비스
 * 
 * 서비스 간 느슨한 결합을 위해 이벤트 기반 통신을 제공합니다.
 * Database per Service 패턴에서 데이터 동기화에 사용됩니다.
 */
@Injectable()
export class EventEmitterService implements OnModuleDestroy {
  private client: ClientProxy;

  constructor() {
    // RabbitMQ 클라이언트 프록시 생성
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'],
        queue: 'events_queue',
        queueOptions: {
          durable: true, // 서버 재시작 시에도 큐 유지
        },
      },
    });
  }

  /**
   * 이벤트 발행
   * 
   * @param eventType - 이벤트 타입 (예: 'employee.created')
   * @param data - 이벤트 데이터 (eventId, eventType, timestamp는 자동 생성)
   */
  async emit<T extends BaseEvent>(
    eventType: string,
    data: Omit<T, 'eventId' | 'eventType' | 'timestamp'>,
  ): Promise<void> {
    const event: T = {
      ...data,
      eventId: uuidv4(), // 멱등성 보장을 위한 고유 ID
      eventType,
      timestamp: new Date(),
    } as T;

    // RabbitMQ로 이벤트 발행
    await this.client.emit(eventType, event).toPromise();
    
    console.log(`[Event Published] ${eventType}:`, {
      eventId: event.eventId,
      tenantId: event.tenantId,
    });
  }

  /**
   * 모듈 종료 시 클라이언트 연결 해제
   */
  async onModuleDestroy() {
    await this.client.close();
  }
}
