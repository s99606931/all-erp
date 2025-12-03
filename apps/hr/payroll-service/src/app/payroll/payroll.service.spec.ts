import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService } from './payroll.service';
import { PrismaService } from '@all-erp/shared/infra';
import { PayrollCalculator } from './payroll.calculator';
import { Prisma } from '@prisma/client';

describe('PayrollService', () => {
  let service: PayrollService;
  let prisma: PrismaService;
  let calculator: PayrollCalculator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        PayrollCalculator,
        {
          provide: PrismaService,
          useValue: {
            employee: {
              findUnique: jest.fn(),
            },
            payroll: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    prisma = module.get<PrismaService>(PrismaService);
    calculator = module.get<PayrollCalculator>(PayrollCalculator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate payroll', async () => {
    const employee = {
      id: 'emp-1',
      tenantId: 'tenant-1',
      salary: new Prisma.Decimal(5000),
    };

    (prisma.employee.findUnique as jest.Mock).mockResolvedValue(employee);
    (prisma.payroll.create as jest.Mock).mockResolvedValue({
      id: 'payroll-1',
      employeeId: 'emp-1',
      period: '2024-01',
      totalAmount: new Prisma.Decimal(4250),
    });

    const result = await service.generatePayroll('emp-1', '2024-01');
    expect(result).toBeDefined();
  });
});
