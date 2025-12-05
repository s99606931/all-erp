import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Channel, connect, Options } from 'amqplib';

/**
 * RabbitMQ 연결 및 메시지 통신 서비스
 *
 * 마이크로서비스 간 비동기 이벤트 통신을 담당합니다.
 * - 자동 연결 및 재연결 로직
 * - Exchange 및 Queue 설정
 * - 메시지 발행 (Publish)
 * - 메시지 구독 (Subscribe)
 * - 에러 처리 및 복구
 */
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 5000; // 5초

  constructor(private readonly configService: ConfigService) {}

  /**
   * 모듈 초기화 시 RabbitMQ 연결
   */
  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  /**
   * 모듈 종료 시 RabbitMQ 연결 해제
   */
  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  /**
   * RabbitMQ 서버에 연결
   * 환경 변수 RABBITMQ_URL에서 연결 정보를 가져옵니다
   */
  private async connect(): Promise<void> {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672');

      this.logger.log(`Connecting to RabbitMQ at ${rabbitmqUrl}...`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.connection = await connect(rabbitmqUrl) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.channel = await (this.connection as any).createChannel();

      this.reconnectAttempts = 0;
      this.logger.log('Successfully connected to RabbitMQ');

      // 연결 종료 이벤트 핸들러
      if (this.connection) {
        this.connection.on('close', () => {
          this.logger.warn('RabbitMQ connection closed');
          this.reconnect();
        });

        // 연결 에러 이벤트 핸들러
        this.connection.on('error', (error) => {
          this.logger.error('RabbitMQ connection error', error.stack);
        });
      }

    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error instanceof Error ? error.stack : error);
      await this.reconnect();
    }
  }

  /**
   * 연결이 끊어졌을 때 자동 재연결
   */
  private async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    this.reconnectAttempts++;
    this.logger.log(`Reconnecting to RabbitMQ (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(async () => {
      await this.connect();
    }, this.reconnectDelay);
  }

  /**
   * RabbitMQ 연결 해제
   */
  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (this.connection as any).close();
        this.connection = null;
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error instanceof Error ? error.stack : error);
    }
  }

  /**
   * Exchange 생성 (이미 존재하면 재사용)
   * @param exchangeName Exchange 이름
   * @param exchangeType Exchange 타입 (direct, topic, fanout, headers)
   * @param options Exchange 옵션
   */
  async assertExchange(
    exchangeName: string,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'topic',
    options?: Options.AssertExchange
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available');
    }

    await this.channel.assertExchange(exchangeName, exchangeType, {
      durable: true,
      ...options,
    });

    this.logger.debug(`Exchange '${exchangeName}' asserted with type '${exchangeType}'`);
  }

  /**
   * Queue 생성 (이미 존재하면 재사용)
   * @param queueName Queue 이름
   * @param options Queue 옵션
   */
  async assertQueue(queueName: string, options?: Options.AssertQueue): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available');
    }

    await this.channel.assertQueue(queueName, {
      durable: true,
      ...options,
    });

    this.logger.debug(`Queue '${queueName}' asserted`);
  }

  /**
   * Queue를 Exchange에 바인딩
   * @param queueName Queue 이름
   * @param exchangeName Exchange 이름
   * @param routingKey 라우팅 키
   */
  async bindQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available');
    }

    await this.channel.bindQueue(queueName, exchangeName, routingKey);
    this.logger.debug(`Queue '${queueName}' bound to exchange '${exchangeName}' with routing key '${routingKey}'`);
  }

  /**
   * 메시지 발행 (Publish)
   * @param exchangeName Exchange 이름
   * @param routingKey 라우팅 키
   * @param message 메시지 내용 (객체 또는 문자열)
   * @param options 발행 옵션
   */
  async publish(
    exchangeName: string,
    routingKey: string,
    message: unknown,
    options?: Options.Publish
  ): Promise<boolean> {
    if (!this.channel) {
      this.logger.error('Cannot publish: RabbitMQ channel is not available');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));

      const sent = this.channel.publish(exchangeName, routingKey, messageBuffer, {
        persistent: true,
        contentType: 'application/json',
        ...options,
      });

      if (sent) {
        this.logger.debug(`Message published to exchange '${exchangeName}' with routing key '${routingKey}'`);
      } else {
        this.logger.warn(`Message buffered (channel flow control) for exchange '${exchangeName}'`);
      }

      return sent;
    } catch (error) {
      this.logger.error(`Failed to publish message to exchange '${exchangeName}'`, error instanceof Error ? error.stack : error);
      return false;
    }
  }

  /**
   * 메시지 구독 (Subscribe)
   * @param queueName Queue 이름
   * @param callback 메시지 수신 시 실행할 콜백 함수
   * @param options 구독 옵션
   */
  async subscribe(
    queueName: string,
    callback: (message: unknown) => Promise<void>,
    options?: Options.Consume
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available');
    }

    await this.channel.consume(
      queueName,
      async (msg) => {
        if (!msg) {
          this.logger.warn('Received null message from queue');
          return;
        }

        try {
          const messageContent = JSON.parse(msg.content.toString());
          this.logger.debug(`Message received from queue '${queueName}'`);

          await callback(messageContent);

          // 메시지 처리 성공 시 ACK
          if (this.channel) {
            this.channel.ack(msg);
          }
        } catch (error) {
          this.logger.error(`Error processing message from queue '${queueName}'`, error instanceof Error ? error.stack : error);

          // 메시지 처리 실패 시 NACK (재시도하지 않고 폐기)
          if (this.channel) {
            this.channel.nack(msg, false, false);
          }
        }
      },
      {
        noAck: false, // 수동 ACK 사용
        ...options,
      }
    );

    this.logger.log(`Subscribed to queue '${queueName}'`);
  }

  /**
   * RabbitMQ 연결 상태 확인 (Health Check)
   * @returns 연결 성공 시 true, 실패 시 false
   */
  isHealthy(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}
