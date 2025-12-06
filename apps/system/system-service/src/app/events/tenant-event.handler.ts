import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMQService } from '@all-erp/shared/infra';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TenantEventHandler {
  private readonly logger = new Logger(TenantEventHandler.name);

  constructor(
    private readonly rabbitmq: RabbitMQService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.rabbitmq.subscribe(
      'tenant.events',
      async (msg: any) => {
        this.logger.log(`Received tenant.created event: ${JSON.stringify(msg)}`);
        await this.handleTenantCreated(msg);
      },
      { noAck: true } // For simplicity in this demo
    );
  }

  private async handleTenantCreated(payload: any) {
    const { tenantId } = payload;
    
    // 기본 공통 코드 생성
    await this.prisma.commonCode.createMany({
      data: [
        { tenantId, groupCode: 'RANK', code: 'STAFF', value: 'Staff' },
        { tenantId, groupCode: 'RANK', code: 'MANAGER', value: 'Manager' },
      ],
    });

    // 기본 부서 생성
    await this.prisma.department.create({
      data: {
        tenantId,
        name: 'Headquarters',
      },
    });

    this.logger.log(`Initialized system data for tenant ${tenantId}`);
  }
}
