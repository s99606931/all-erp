import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { Response, Request } from 'express';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    
    // Mock Response 객체
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    // Mock Request 객체
    mockRequest = {
      method: 'GET',
      url: '/api/test',
    };
    
    // Mock ArgumentsHost
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  describe('HttpException 처리', () => {
    it('HttpException을 표준 포맷으로 변환해야 함', () => {
      const exception = new HttpException('테스트 에러', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);
      
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '테스트 에러',
          timestamp: expect.any(String),
        })
      );
    });

    it('HttpException의 객체 응답을 처리해야 함', () => {
      const exceptionResponse = {
        message: '유효성 검사 실패',
        code: 'VALIDATION_ERROR',
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);
      
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '유효성 검사 실패',
          code: 'VALIDATION_ERROR',
        })
      );
    });

    it('배열 형태의 메시지를 처리해야 함', () => {
      const exceptionResponse = {
        message: ['에러1', '에러2', '에러3'],
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);
      
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: '에러1', // 첫 번째 메시지만 사용
        })
      );
    });

    it('다양한 HTTP 상태 코드를 처리해야 함', () => {
      const testCases = [
        HttpStatus.BAD_REQUEST,
        HttpStatus.NOT_FOUND,
        HttpStatus.FORBIDDEN,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ];
      
      testCases.forEach((status) => {
        const exception = new HttpException('테스트', status);
        filter.catch(exception, mockHost);
        
        expect(mockResponse.status).toHaveBeenCalledWith(status);
      });
    });
  });

  describe('Error 처리', () => {
    it('일반 Error를 INTERNAL_SERVER_ERROR로 변환해야 함', () => {
      const error = new Error('예상치 못한 에러');
      
      filter.catch(error, mockHost);
      
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '예상치 못한 에러',
          code: 'INTERNAL_SERVER_ERROR',
        })
      );
    });

    it('알 수 없는 예외도 처리해야 함', () => {
      const exception = 'string exception'; // 문자열 예외
      
      filter.catch(exception, mockHost);
      
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        })
      );
    });
  });

  describe('응답 구조', () => {
    it('응답에 필수 필드가 포함되어야 함', () => {
      const exception = new HttpException('테스트', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);
      
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('message');
      expect(responseData).toHaveProperty('code');
      expect(responseData).toHaveProperty('timestamp');
    });

    it('timestamp는 ISO 형식이어야 함', () => {
      const exception = new HttpException('테스트', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);
      
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      expect(responseData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
