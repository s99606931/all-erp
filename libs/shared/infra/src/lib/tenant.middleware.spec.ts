import { Test, TestingModule } from '@nestjs/testing';
import { TenantMiddleware } from './tenant.middleware';
import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '@nestjs/common';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantMiddleware],
    }).compile();

    middleware = module.get<TenantMiddleware>(TenantMiddleware);
    
    mockRequest = {
      headers: {},
      tenantId: undefined,
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env['REQUIRE_TENANT_ID'];
  });

  describe('HTTP 헤더에서 테넌트 ID 추출', () => {
    it('X-Tenant-ID 헤더에서 tenantId를 추출해야 함', () => {
      mockRequest.headers = { 'x-tenant-id': 'tenant-123' };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBe('tenant-123');
      expect(mockNext).toHaveBeenCalled();
    });

    it('헤더가 없으면 tenantId는 undefined여야 함', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Subdomain에서 테넌트 ID 추출', () => {
    it('서브도메인에서 tenantId를 추출해야 함', () => {
      mockRequest.headers = { host: 'tenant1.erp.com' };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBe('tenant1');
      expect(mockNext).toHaveBeenCalled();
    });

    it('www 서브도메인은 무시해야 함', () => {
      mockRequest.headers = { host: 'www.erp.com' };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBeUndefined();
    });

    it('localhost는 서브도메인으로 처리하지 않아야 함', () => {
      mockRequest.headers = { host: 'localhost:3000' };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBeUndefined();
    });

    it('IP 주소는 서브도메인으로 처리하지 않아야 함', () => {
      mockRequest.headers = { host: '192.168.1.1' };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBeUndefined();
    });
  });

  describe('헤더 우선순위', () => {
    it('HTTP 헤더가 서브도메인보다 우선해야 함', () => {
      mockRequest.headers = {
        'x-tenant-id': 'tenant-from-header',
        host: 'tenant-from-subdomain.erp.com',
      };
      
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockRequest.tenantId).toBe('tenant-from-header');
    });
  });

  describe('REQUIRE_TENANT_ID 설정', () => {
    it('REQUIRE_TENANT_ID=true이고 tenantId가 없으면 에러를 throw해야 함', () => {
      process.env['REQUIRE_TENANT_ID'] = 'true';
      
      // REQUIRE_TENANT_ID가 true로 설정되었으므로 새 인스턴스 생성
      const strictMiddleware = new TenantMiddleware();
      
      expect(() => {
        strictMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(BadRequestException);
    });

    it('REQUIRE_TENANT_ID=false이면 tenantId 없이도 통과해야 함', () => {
      process.env['REQUIRE_TENANT_ID'] = 'false';
      const lenientMiddleware = new TenantMiddleware();
      
      lenientMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.tenantId).toBeUndefined();
    });
  });
});
