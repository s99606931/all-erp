import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockWinstonLogger: any;

  beforeEach(async () => {
    // Mock Winston Logger
    mockWinstonLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockWinstonLogger,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('debug', () => {
    it('Winston logger의 debug 메서드를 호출해야 함', () => {
      const message = '디버그 메시지';
      const context = 'TestContext';
      const meta = { key: 'value' };
      
      service.debug(message, context, meta);
      
      expect(mockWinstonLogger.debug).toHaveBeenCalledWith(message, { context, key: 'value' });
    });
  });

  describe('log', () => {
    it('Winston logger의 info 메서드를 호출해야 함', () => {
      const message = '정보 메시지';
      const context = 'TestContext';
      
      service.log(message, context);
      
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, { context });
    });
  });

  describe('warn', () => {
    it('Winston logger의 warn 메서드를 호출해야 함', () => {
      const message = '경고 메시지';
      
      service.warn(message);
      
      expect(mockWinstonLogger.warn).toHaveBeenCalledWith(message, {});
    });
  });

  describe('error', () => {
    it('Winston logger의 error 메서드를 호출해야 함', () => {
      const message = '에러 메시지';
      const trace = 'Error stack trace';
      const context = 'ErrorContext';
      
      service.error(message, trace, context);
      
      expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, { trace, context });
    });
  });

  describe('logHttpRequest', () => {
    it('HTTP 요청 정보를 로깅해야 함', () => {
      const method = 'GET';
      const url = '/api/users';
      const statusCode = 200;
      const responseTime = 150;
      
      service.logHttpRequest(method, url, statusCode, responseTime);
      
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(
        'GET /api/users 200 150ms',
        expect.objectContaining({
          context: 'HTTP',
          method,
          url,
          statusCode,
          responseTime,
        })
      );
    });

    it('추가 메타데이터를 포함할 수 있어야 함', () => {
      service.logHttpRequest('POST', '/api/users', 201, 200, { userId: '123' });
      
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          userId: '123',
        })
      );
    });
  });
});
