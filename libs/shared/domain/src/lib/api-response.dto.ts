/**
 * 공통 API 응답 DTO
 */

export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  timestamp: string;

  constructor(success: boolean, data?: T, message?: string, code?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  static error<T>(message: string, code = 'INTERNAL_SERVER_ERROR', data?: T): ApiResponse<T> {
    return new ApiResponse(false, data, message, code);
  }
}

export class PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
