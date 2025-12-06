import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../../prisma.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: PrismaService,
          useValue: {
            employee: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an employee', async () => {
    const dto = {
      userId: 'user-1',
      tenantId: 'tenant-1',
      position: 'Manager',
      salary: 50000,
      joinDate: '2023-01-01',
    };

    const created = { id: 'emp-1', ...dto };
    (prisma.employee.create as jest.Mock).mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
  });
});
