import { HttpStatus } from '@nestjs/common';
import { BusinessException, EntityNotFoundException, InvalidInputException } from './business.exception';

describe('BusinessException', () => {
  it('커스텀 예외를 생성해야 함', () => {
    const exception = new BusinessException('에러 메시지', 'CUSTOM_ERROR', HttpStatus.BAD_REQUEST);

    expect(exception).toBeInstanceOf(BusinessException);
    expect(exception.message).toBeDefined();
  });

  it('응답 객체에 메시지와 코드가 포함되어야 함', () => {
    const exception = new BusinessException('에러 발생', 'ERROR_CODE');
    const response = exception.getResponse() as { message: string; code: string; success: boolean; timestamp: string };

    expect(response.message).toBe('에러 발생');
    expect(response.code).toBe('ERROR_CODE');
    expect(response.success).toBe(false);
    expect(response.timestamp).toBeDefined();
  });

  it('기본 상태 코드는 BAD_REQUEST여야 함', () => {
    const exception = new BusinessException('에러', 'CODE');

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('커스텀 상태 코드를 설정할 수 있어야 함', () => {
    const exception = new BusinessException('에러', 'CODE', HttpStatus.FORBIDDEN);

    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
  });
});

describe('EntityNotFoundException', () => {
  it('엔티티 이름만으로 예외를 생성할 수 있어야 함', () => {
    const exception = new EntityNotFoundException('User');
    const response = exception.getResponse() as { message: string; code: string };

    expect(response.message).toBe('User not found');
    expect(response.code).toBe('ENTITY_NOT_FOUND');
  });

  it('엔티티 ID를 포함할 수 있어야 함', () => {
    const exception = new EntityNotFoundException('User', 'user-123');
    const response = exception.getResponse() as { message: string };

    expect(response.message).toBe('User not found with ID user-123');
  });

  it('숫자 ID도 처리해야 함', () => {
    const exception = new EntityNotFoundException('Product', 456);
    const response = exception.getResponse() as { message: string };

    expect(response.message).toBe('Product not found with ID 456');
  });

  it('상태 코드는 NOT_FOUND여야 함', () => {
    const exception = new EntityNotFoundException('User', 1);

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});

describe('InvalidInputException', () => {
  it('잘못된 입력 예외를 생성해야 함', () => {
    const exception = new InvalidInputException('이메일 형식이 올바르지 않습니다');
    const response = exception.getResponse() as { message: string; code: string };

    expect(response.message).toBe('이메일 형식이 올바르지 않습니다');
    expect(response.code).toBe('INVALID_INPUT');
  });

  it('상태 코드는 BAD_REQUEST여야 함', () => {
    const exception = new InvalidInputException('잘못된 입력');

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
