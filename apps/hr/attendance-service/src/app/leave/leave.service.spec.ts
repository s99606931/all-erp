import { Test, TestingModule } from '@nestjs/testing';
import { LeaveService } from './leave.service';
import { PrismaService } from '../../prisma.service';

describe('LeaveService', () => {
  let service: LeaveService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveService,
        {
          provide: PrismaService,
          useValue: {
            leaveRequest: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LeaveService>(LeaveService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create leave request', async () => {
    const dto = {
      employeeId: 'emp-1',
      tenantId: 'tenant-1',
      type: 'ANNUAL',
      startDate: '2024-01-01',
      endDate: '2024-01-05',
    };
    const created = { id: 'leave-1', ...dto };
    (prisma.leaveRequest.create as jest.Mock).mockResolvedValue(created);

    const result = await service.requestLeave(dto);
    expect(result).toEqual(created);
  });
});
