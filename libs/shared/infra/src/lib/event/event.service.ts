import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OutboxRepository } from './outbox.repository.interface';

export const OUTBOX_REPO = 'OUTBOX_REPOSITORY';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(@Inject(OUTBOX_REPO) private readonly repository: OutboxRepository) {}

  /**
   * 이벤트를 Outbox 패턴으로 발행
   * Raw Query를 사용하여 Prisma 모델 생성 여부와 무관하게 동작
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async emit(eventType: string, payload: any, tx?: any): Promise<void> {
    const repo = tx || this.repository;
    const id = uuidv4();
    const eventId = uuidv4();
    const payloadJson = JSON.stringify(payload);
    const now = new Date();

    try {
      // PostgreSQL 기준 쿼리
      await repo.$executeRawUnsafe(
        `INSERT INTO "outbox_events" ("id", "event_id", "event_type", "payload", "status", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        id, eventId, eventType, payloadJson, 'PENDING', now, now
      );
      this.logger.log(`Event staged in Outbox: ${eventType} (${eventId})`);
    } catch (error) {
      this.logger.error(`Failed to stage event: ${eventType}`, error instanceof Error ? error.stack : error);
      throw error;
    }
  }
}
