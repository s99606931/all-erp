import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { PrismaService } from '../../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('JournalService', () => {
  let service: JournalService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        {
          provide: PrismaService,
          useValue: {
            journalEntry: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JournalService>(JournalService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create journal entry with balanced debit and credit', async () => {
    const dto = {
      tenantId: 'tenant-1',
      entryDate: '2024-01-01',
      description: 'Test entry',
      lines: [
        { accountId: 'acc-1', debit: 1000, credit: 0 },
        { accountId: 'acc-2', debit: 0, credit: 1000 },
      ],
    };

    (prisma.journalEntry.create as jest.Mock).mockResolvedValue({ id: 'je-1' });

    const result = await service.createEntry(dto);
    expect(result).toBeDefined();
  });

  it('should reject unbalanced journal entry', async () => {
    const dto = {
      tenantId: 'tenant-1',
      entryDate: '2024-01-01',
      description: 'Test entry',
      lines: [
        { accountId: 'acc-1', debit: 1000, credit: 0 },
        { accountId: 'acc-2', debit: 0, credit: 500 }, // Unbalanced!
      ],
    };

    await expect(service.createEntry(dto)).rejects.toThrow(BadRequestException);
  });
});
