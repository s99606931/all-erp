import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';
import { PrismaService } from '@all-erp/shared/infra';
import { Prisma } from '@prisma/client';

describe('BudgetService', () => {
  let service: BudgetService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: PrismaService,
          useValue: {
            budget: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a budget', async () => {
    const dto = {
      tenantId: 'tenant-1',
      category: 'PERSONNEL',
      fiscalYear: 2024,
      amount: 1000000,
    };

    const created = { id: 'budget-1', ...dto, spent: new Prisma.Decimal(0) };
    (prisma.budget.create as jest.Mock).mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
  });
});
