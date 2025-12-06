import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { RabbitMQService } from '@all-erp/shared/infra';
import { PrismaService } from '../../prisma.service';

describe('TenantService', () => {
  let service: TenantService;
  let prisma: PrismaService;
  let rabbitmq: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: PrismaService,
          useValue: {
            tenant: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    prisma = module.get<PrismaService>(PrismaService);
    rabbitmq = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTenant', () => {
    it('should create a tenant and publish an event', async () => {
      const dto = { name: 'Test Corp', subdomain: 'test' };
      const createdTenant = { id: '1', ...dto, subscriptionPlan: 'FREE', createdAt: new Date(), updatedAt: new Date() };

      (prisma.tenant.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.tenant.create as jest.Mock).mockResolvedValue(createdTenant);

      const result = await service.createTenant(dto);

      expect(result).toEqual(createdTenant);
      expect(prisma.tenant.create).toHaveBeenCalledWith({
        data: { ...dto, subscriptionPlan: 'FREE' },
      });
      expect(rabbitmq.publish).toHaveBeenCalledWith('tenant.events', 'tenant.created', {
        tenantId: createdTenant.id,
        name: createdTenant.name,
        subdomain: createdTenant.subdomain,
      });
    });
  });
});
