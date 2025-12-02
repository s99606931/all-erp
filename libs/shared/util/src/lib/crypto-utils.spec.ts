import {
  hashPassword,
  comparePassword,
  base64Encode,
  base64Decode,
} from './crypto-utils';

describe('Crypto Utils', () => {
  describe('hashPassword', () => {
    it('비밀번호를 해시해야 함', async () => {
      const password = 'password123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('bcrypt 해시 형식이어야 함', async () => {
      const password = 'password123';
      const hash = await hashPassword(password);
      
      // bcrypt 해시는 $2a$ 또는 $2b$로 시작
      expect(hash).toMatch(/^\$2[ab]\$/);
    });

    it('같은 비밀번호라도 다른 해시를 생성해야 함 (salt)', async () => {
      const password = 'password123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('saltRounds를 지정할 수 있어야 함', async () => {
      const password = 'password123';
      const hash = await hashPassword(password, 5);
      
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[ab]\$/);
    });
  });

  describe('comparePassword', () => {
    it('올바른 비밀번호는 true를 반환해야 함', async () => {
      const password = 'password123';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);
      
      expect(result).toBe(true);
    });

    it('틀린 비밀번호는 false를 반환해야 함', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hash = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hash);
      
      expect(result).toBe(false);
    });

    it('대소문자를 구분해야 함', async () => {
      const password = 'Password123';
      const hash = await hashPassword(password);
      const result = await comparePassword('password123', hash);
      
      expect(result).toBe(false);
    });
  });

  describe('base64Encode', () => {
    it('문자열을 Base64로 인코딩해야 함', () => {
      const input = 'Hello World';
      const result = base64Encode(input);
      
      expect(result).toBe('SGVsbG8gV29ybGQ=');
    });

    it('한글도 올바르게 인코딩해야 함', () => {
      const input = '안녕하세요';
      const result = base64Encode(input);
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('빈 문자열은 빈 Base64를 반환해야 함', () => {
      const result = base64Encode('');
      
      expect(result).toBe('');
    });

    it('특수문자도 처리해야 함', () => {
      const input = '!@#$%^&*()';
      const result = base64Encode(input);
      
      expect(result).toBeDefined();
    });
  });

  describe('base64Decode', () => {
    it('Base64 문자열을 디코딩해야 함', () => {
      const encoded = 'SGVsbG8gV29ybGQ=';
      const result = base64Decode(encoded);
      
      expect(result).toBe('Hello World');
    });

    it('한글도 올바르게 디코딩해야 함', () => {
      const input = '안녕하세요';
      const encoded = base64Encode(input);
      const decoded = base64Decode(encoded);
      
      expect(decoded).toBe(input);
    });

    it('인코딩-디코딩이 가역적이어야 함', () => {
      const original = 'Test String 123 !@#';
      const encoded = base64Encode(original);
      const decoded = base64Decode(encoded);
      
      expect(decoded).toBe(original);
    });
  });
});
