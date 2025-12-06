import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { RabbitMQService } from '@all-erp/shared/infra';
import { PrismaService } from '../../prisma.service';
import { CreateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async createTenant(dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { subdomain: dto.subdomain },
    });

    if (existing) {
      throw new ConflictException('Subdomain already exists');
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        subdomain: dto.subdomain,
        subscriptionPlan: dto.subscriptionPlan || 'FREE',
      },
    });

    this.logger.log(`Tenant created: ${tenant.name} (${tenant.id})`);

    // 이벤트 발행
    await this.rabbitmq.publish('tenant.events', 'tenant.created', {
      tenantId: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
    });

    return tenant;
  }

  async getTenant(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async getAllTenants() {
    return this.prisma.tenant.findMany();
  }
}
