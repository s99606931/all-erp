import { ApiResponse, PaginatedResponse } from './api-response.dto';

describe('ApiResponse', () => {
  describe('constructor', () => {
    it('모든 필드를 올바르게 초기화해야 함', () => {
      const response = new ApiResponse(true, { id: 1 }, 'Success', 'OK');
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: 1 });
      expect(response.message).toBe('Success');
      expect(response.code).toBe('OK');
      expect(response.timestamp).toBeDefined();
    });

    it('timestamp는 ISO 형식이어야 함', () => {
      const response = new ApiResponse(true);
      
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('success', () => {
    it('성공 응답을 생성해야 함', () => {
      const data = { id: 1, name: 'Test' };
      const response = ApiResponse.success(data);
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.message).toBe('Success');
      expect(response.timestamp).toBeDefined();
    });

    it('커스텀 메시지를 설정할 수 있어야 함', () => {
      const data = { id: 1 };
      const response = ApiResponse.success(data, '생성 완료');
      
      expect(response.success).toBe(true);
      expect(response.message).toBe('생성 완료');
    });

    it('데이터 없이도 성공 응답을 생성할 수 있어야 함', () => {
      const response = ApiResponse.success(null);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });
  });

  describe('error', () => {
    it('에러 응답을 생성해야 함', () => {
      const response = ApiResponse.error('에러 발생', 'ERROR_CODE');
      
      expect(response.success).toBe(false);
      expect(response.message).toBe('에러 발생');
      expect(response.code).toBe('ERROR_CODE');
      expect(response.timestamp).toBeDefined();
    });

    it('기본 에러 코드는 INTERNAL_SERVER_ERROR여야 함', () => {
      const response = ApiResponse.error('에러 발생');
      
      expect(response.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('에러 응답에도 데이터를 포함할 수 있어야 함', () => {
      const errorData = { field: 'email', reason: 'invalid' };
      const response = ApiResponse.error('유효성 검사 실패', 'VALIDATION_ERROR', errorData);
      
      expect(response.success).toBe(false);
      expect(response.data).toEqual(errorData);
    });
  });
});

describe('PaginatedResponse', () => {
  describe('constructor', () => {
    it('모든 필드를 올바르게 초기화해야 함', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const response = new PaginatedResponse(items, 10, 1, 3);
      
      expect(response.items).toEqual(items);
      expect(response.total).toBe(10);
      expect(response.page).toBe(1);
      expect(response.limit).toBe(3);
    });

    it('totalPages를 올바르게 계산해야 함', () => {
      const response = new PaginatedResponse([], 10, 1, 3);
      
      expect(response.totalPages).toBe(4); // Math.ceil(10 / 3) = 4
    });

    it('딱 나누어떨어지는 경우도 올바르게 계산해야 함', () => {
      const response = new PaginatedResponse([], 10, 1, 5);
      
      expect(response.totalPages).toBe(2); // Math.ceil(10 / 5) = 2
    });

    it('total이 0이면 totalPages도 0이어야 함', () => {
      const response = new PaginatedResponse([], 0, 1, 10);
      
      expect(response.totalPages).toBe(0);
    });

    it('total이 limit보다 작으면 totalPages는 1이어야 함', () => {
      const response = new PaginatedResponse([], 5, 1, 10);
      
      expect(response.totalPages).toBe(1);
    });
  });
});
