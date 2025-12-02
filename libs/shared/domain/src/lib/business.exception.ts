/**
 * 비즈니스 로직 예외 클래스
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, code: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        message,
        code,
        success: false,
        timestamp: new Date().toISOString(),
      },
      status
    );
  }
}

export class EntityNotFoundException extends BusinessException {
  constructor(entityName: string, id?: string | number) {
    super(
      `${entityName} not found${id ? ` with ID ${id}` : ''}`,
      'ENTITY_NOT_FOUND',
      HttpStatus.NOT_FOUND
    );
  }
}

export class InvalidInputException extends BusinessException {
  constructor(message: string) {
    super(message, 'INVALID_INPUT', HttpStatus.BAD_REQUEST);
  }
}
