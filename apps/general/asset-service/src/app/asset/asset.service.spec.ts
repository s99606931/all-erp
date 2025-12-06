import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from '../../prisma.service';

describe('AssetService', () => {
  let service: AssetService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: PrismaService,
          useValue: {
            asset: {
              count: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            assetHistory: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create asset with auto-generated asset number', async () => {
    const dto = {
      tenantId: 'tenant-1',
      name: 'Laptop',
      category: 'IT',
      acquisitionDate: '2024-01-01',
      acquisitionValue: 1500000,
    };

    (prisma.asset.count as jest.Mock).mockResolvedValue(5);
    (prisma.asset.create as jest.Mock).mockResolvedValue({ id: 'asset-1', assetNumber: 'AST-006' });
    (prisma.assetHistory.create as jest.Mock).mockResolvedValue({});

    const result = await service.create(dto);
    expect(result.assetNumber).toBe('AST-006');
  });
});
