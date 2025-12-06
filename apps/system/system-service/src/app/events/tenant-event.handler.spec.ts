import { Test, TestingModule } from '@nestjs/testing';
import { TenantEventHandler } from './tenant-event.handler';
import { RabbitMQService } from '@all-erp/shared/infra';
import { PrismaService } from '../../prisma.service';

describe('TenantEventHandler', () => {
  let handler: TenantEventHandler;
  let prisma: PrismaService;
  let rabbitmq: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantEventHandler,
        {
          provide: PrismaService,
          useValue: {
            commonCode: { createMany: jest.fn() },
            department: { create: jest.fn() },
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            subscribe: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<TenantEventHandler>(TenantEventHandler);
    prisma = module.get<PrismaService>(PrismaService);
    rabbitmq = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handleTenantCreated', () => {
    it('should create initial system data', async () => {
      const payload = { tenantId: 'tenant-1' };
      
      // Access private method for testing
      await (handler as any).handleTenantCreated(payload);

      expect(prisma.commonCode.createMany).toHaveBeenCalled();
      expect(prisma.department.create).toHaveBeenCalled();
    });
  });
});
