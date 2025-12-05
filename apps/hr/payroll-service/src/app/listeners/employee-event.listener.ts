import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RabbitMQService, PrismaService } from '@all-erp/shared/infra';

interface StandardEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: any;
}

@Injectable()
export class EmployeeEventListener implements OnModuleInit {
  private readonly logger = new Logger(EmployeeEventListener.name);

  constructor(
    private readonly rabbitmq: RabbitMQService,
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    try {
      // 큐 생성 및 바인딩
      await this.rabbitmq.assertQueue('payroll.employee.created', { durable: true });
      await this.rabbitmq.bindQueue('payroll.employee.created', 'amq.topic', 'employee.created');

      // 구독 시작
      await this.rabbitmq.subscribe('payroll.employee.created', async (msg: any) => {
        const event = msg as StandardEvent;
        const { eventId, eventType, data } = event;

        this.logger.log(`[Event Received] ${eventType} (${eventId})`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prismaAny = this.prisma as any;

        // 1. 멱등성 검사 (Raw Query)
        // processed_events 테이블이 있는지 확인 필요 (Migration으로 생성됨)
        try {
          const existing = await prismaAny.$queryRawUnsafe(
            `SELECT event_id FROM processed_events WHERE event_id = $1`,
            eventId
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (existing && (existing as any[]).length > 0) {
            this.logger.warn(`Event ${eventId} already processed. Skipping.`);
            return;
          }

          // 2. 비즈니스 로직 및 처리 기록 (트랜잭션)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await prismaAny.$transaction(async (tx: any) => {
            // TODO: 실제 급여 정보 생성 로직 구현
            // await tx.payroll.create({ data: { employeeId: data.employeeId ... } });

            this.logger.log(`Creating payroll record for employee: ${data.name} (${data.employeeId})`);

            // 3. 처리 완료 기록
            const now = new Date();
            await tx.$executeRawUnsafe(
              `INSERT INTO "processed_events" ("event_id", "event_type", "processed_at", "created_at") VALUES ($1, $2, $3, $4)`,
              eventId, eventType, now, now
            );
          });

          this.logger.log(`Successfully processed event ${eventId}`);
        } catch (error) {
           this.logger.error(`Error processing event ${eventId}`, error);
           throw error; // NACK를 위해 에러 다시 던짐
        }
      });

      this.logger.log('EmployeeEventListener initialized and subscribing.');
    } catch (error) {
      this.logger.error('Failed to initialize EmployeeEventListener', error);
    }
  }
}
