import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '@all-erp/shared/infra';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: PrismaService,
          useValue: {
            attendance: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check in', async () => {
    const record = { id: 'att-1', employeeId: 'emp-1', status: 'PRESENT' };
    (prisma.attendance.create as jest.Mock).mockResolvedValue(record);

    const result = await service.checkIn('emp-1', 'tenant-1');
    expect(result).toEqual(record);
  });
});
