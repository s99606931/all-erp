import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { OutboxRepository } from './outbox.repository.interface';
import { OUTBOX_REPO } from './event.service';

@Injectable()
export class OutboxRelay {
  private readonly logger = new Logger(OutboxRelay.name);
  private isRunning = false;

  constructor(
    @Inject(OUTBOX_REPO) private readonly repository: OutboxRepository,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleOutbox() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      if (!this.rabbitmq.isHealthy()) {
        this.isRunning = false;
        return;
      }

      // 1. PENDING 상태의 이벤트 조회 (Raw Query)
      const events = await this.repository.$queryRawUnsafe<any[]>(
        `SELECT * FROM "outbox_events" WHERE "status" = 'PENDING' ORDER BY "created_at" ASC LIMIT 50`
      );

      if (!events || events.length === 0) {
        this.isRunning = false;
        return;
      }

      for (const event of events) {
        try {
          // 2. RabbitMQ로 발행 (Standard Event Envelope)
          const message = {
            eventId: event.event_id,
            eventType: event.event_type,
            timestamp: event.created_at,
            data: JSON.parse(event.payload),
          };

          const success = await this.rabbitmq.publish(
            'amq.topic',
            event.event_type,
            message
          );

          if (success) {
            // 3. 성공 시 상태 업데이트 (Raw Query)
            await this.repository.$executeRawUnsafe(
              `UPDATE "outbox_events" SET "status" = 'PUBLISHED', "updated_at" = $1 WHERE "id" = $2`,
              new Date(), event.id
            );
            this.logger.debug(`Published event: ${event.event_type} (${event.event_id})`);
          }
        } catch (error) {
          this.logger.error(`Failed to publish event ${event.event_id}`, error instanceof Error ? error.stack : error);
        }
      }
    } catch (error) {
      this.logger.error('Error in Outbox Relay', error instanceof Error ? error.stack : error);
    } finally {
      this.isRunning = false;
    }
  }
}
