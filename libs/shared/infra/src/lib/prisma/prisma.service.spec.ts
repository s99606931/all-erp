import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.module';

// PrismaClient Mock
const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
  $use: jest.fn(),
  $on: jest.fn(),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = mockPrismaClient.$connect;
      $disconnect = mockPrismaClient.$disconnect;
      $queryRaw = mockPrismaClient.$queryRaw;
      $use = mockPrismaClient.$use;
      $on = mockPrismaClient.$on;
    },
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  describe('onModuleInit', () => {
    it('Prisma 클라이언트에 연결해야 함', async () => {
      mockPrismaClient.$connect.mockResolvedValue(undefined);
      
      await service.onModuleInit();
      
      expect(mockPrismaClient.$connect).toHaveBeenCalled();
    });

    it('연결 실패 시 에러를 throw해야 함', async () => {
      const error = new Error('Connection failed');
      mockPrismaClient.$connect.mockRejectedValue(error);
      
      await expect(service.onModuleInit()).rejects.toThrow(error);
    });
  });

  describe('onModuleDestroy', () => {
    it('Prisma 클라이언트와의 연결을 해제해야 함', async () => {
      mockPrismaClient.$disconnect.mockResolvedValue(undefined);
      
      await service.onModuleDestroy();
      
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });
  });

  describe('isHealthy', () => {
    it('데이터베이스 연결이 정상이면 true를 반환해야 함', async () => {
      mockPrismaClient.$queryRaw.mockResolvedValue([{ result: 1 }]);
      
      const result = await service.isHealthy();
      
      expect(result).toBe(true);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });

    it('데이터베이스 연결 실패 시 false를 반환해야 함', async () => {
      mockPrismaClient.$queryRaw.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.isHealthy();
      
      expect(result).toBe(false);
    });
  });

  describe('setTenantId', () => {
    it('global 객체에 tenantId를 설정해야 함', () => {
      const tenantId = 'tenant-123';
      
      service.setTenantId(tenantId);
      
      expect((global as any).currentTenantId).toBe(tenantId);
    });
  });

  describe('clearTenantId', () => {
    it('global 객체에서 tenantId를 제거해야 함', () => {
      (global as any).currentTenantId = 'tenant-123';
      
      service.clearTenantId();
      
      expect((global as any).currentTenantId).toBeUndefined();
    });
  });
});
