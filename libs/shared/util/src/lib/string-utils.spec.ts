import {
  generateRandomString,
  capitalize,
  snakeToCamel,
  camelToSnake,
  maskString,
  maskEmail,
} from './string-utils';

describe('String Utils', () => {
  describe('generateRandomString', () => {
    it('지정된 길이의 문자열을 생성해야 함', () => {
      const result = generateRandomString(10);
      
      expect(result).toHaveLength(10);
    });

    it('영문 대소문자와 숫자만 포함해야 함', () => {
      const result = generateRandomString(100);
      
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('호출마다 다른 문자열을 생성해야 함', () => {
      const result1 = generateRandomString(20);
      const result2 = generateRandomString(20);
      
      expect(result1).not.toBe(result2);
    });

    it('길이가 0이면 빈 문자열을 반환해야 함', () => {
      const result = generateRandomString(0);
      
      expect(result).toBe('');
    });
  });

  describe('capitalize', () => {
    it('첫 글자를 대문자로 변환해야 함', () => {
      const result = capitalize('hello');
      
      expect(result).toBe('Hello');
    });

    it('이미 대문자인 경우 그대로 유지해야 함', () => {
      const result = capitalize('Hello');
      
      expect(result).toBe('Hello');
    });

    it('한 글자 문자열도 처리해야 함', () => {
      const result = capitalize('a');
      
      expect(result).toBe('A');
    });

    it('빈 문자열은 그대로 반환해야 함', () => {
      const result = capitalize('');
      
      expect(result).toBe('');
    });
  });

  describe('snakeToCamel', () => {
    it('snake_case를 camelCase로 변환해야 함', () => {
      const result = snakeToCamel('user_name');
      
      expect(result).toBe('userName');
    });

    it('여러 단어도 올바르게 변환해야 함', () => {
      const result = snakeToCamel('first_name_last_name');
      
      expect(result).toBe('firstNameLastName');
    });

    it('하이픈도 처리해야 함', () => {
      const result = snakeToCamel('user-name');
      
      expect(result).toBe('userName');
    });

    it('이미 camelCase인 경우 그대로 유지해야 함', () => {
      const result = snakeToCamel('userName');
      
      expect(result).toBe('userName');
    });
  });

  describe('camelToSnake', () => {
    it('camelCase를 snake_case로 변환해야 함', () => {
      const result = camelToSnake('userName');
      
      expect(result).toBe('user_name');
    });

    it('여러 단어도 올바르게 변환해야 함', () => {
      const result = camelToSnake('firstNameLastName');
      
      expect(result).toBe('first_name_last_name');
    });

    it('연속된 대문자도 처리해야 함', () => {
      const result = camelToSnake('userID');
      
      expect(result).toBe('user_i_d');
    });

    it('소문자만 있으면 그대로 유지해야 함', () => {
      const result = camelToSnake('username');
      
      expect(result).toBe('username');
    });
  });

  describe('maskString', () => {
    it('기본적으로 첫 글자를 제외하고 마스킹해야 함', () => {
      const result = maskString('홍길동');
      
      expect(result).toBe('홍**');
    });

    it('visibleCount만큼 앞부분을 보여주어야 함', () => {
      const result = maskString('홍길동', 2);
      
      expect(result).toBe('홍길*');
    });

    it('문자열이 visibleCount보다 짧으면 그대로 반환해야 함', () => {
      const result = maskString('홍', 2);
      
      expect(result).toBe('홍');
    });

    it('빈 문자열은 그대로 반환해야 함', () => {
      const result = maskString('');
      
      expect(result).toBe('');
    });
  });

  describe('maskEmail', () => {
    it('이메일의 로컬 파트를 마스킹해야 함', () => {
      const result = maskEmail('user@example.com');
      
      expect(result).toBe('us***@example.com');
    });

    it('짧은 이메일도 마스킹해야 함', () => {
      const result = maskEmail('ab@example.com');
      
      expect(result).toBe('ab***@example.com');
    });

    it('한 글자 로컬 파트도 처리해야 함', () => {
      const result = maskEmail('a@example.com');
      
      expect(result).toBe('a***@example.com');
    });

    it('@가 없으면 그대로 반환해야 함', () => {
      const result = maskEmail('notanemail');
      
      expect(result).toBe('notanemail');
    });

    it('빈 문자열은 그대로 반환해야 함', () => {
      const result = maskEmail('');
      
      expect(result).toBe('');
    });
  });
});
