import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '@all-erp/shared/infra';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: {
            inventory: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            inventoryTransaction: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should prevent negative inventory', async () => {
    (prisma.inventory.findUnique as jest.Mock).mockResolvedValue({ id: 'inv-1', quantity: new Prisma.Decimal(10) });

    await expect(service.recordTransaction('inv-1', 'OUT', 20, '2024-01-01')).rejects.toThrow(BadRequestException);
  });
});
