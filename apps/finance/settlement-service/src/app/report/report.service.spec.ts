import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../../prisma.service';

describe('ReportService', () => {
  let service: ReportService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: {
            journalEntryLine: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate trial balance', async () => {
    (prisma.journalEntryLine.findMany as jest.Mock).mockResolvedValue([]);

    const result = await service.generateTrialBalance('tenant-1', '2024-01-01', '2024-12-31');
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
