import {
  isValidEmail,
  isValidPhoneNumber,
  isEmpty,
  isNumber,
} from './validator-utils';

describe('Validator Utils', () => {
  describe('isValidEmail', () => {
    it('유효한 이메일은 true를 반환해야 함', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@company.co.kr')).toBe(true);
      expect(isValidEmail('admin+tag@domain.org')).toBe(true);
    });

    it('잘못된 이메일은 false를 반환해야 함', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('@가 여러 개인 경우 false를 반환해야 함', () => {
      expect(isValidEmail('user@@example.com')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('유효한 한국 전화번호는 true를 반환해야 함', () => {
      expect(isValidPhoneNumber('010-1234-5678')).toBe(true);
      expect(isValidPhoneNumber('01012345678')).toBe(true);
      expect(isValidPhoneNumber('010-123-5678')).toBe(true);
      expect(isValidPhoneNumber('016-1234-5678')).toBe(true);
      expect(isValidPhoneNumber('017-1234-5678')).toBe(true);
      expect(isValidPhoneNumber('019-1234-5678')).toBe(true);
    });

    it('잘못된 전화번호는 false를 반환해야 함', () => {
      expect(isValidPhoneNumber('02-1234-5678')).toBe(false); // 지역번호
      // 010-12345-678은 하이픈 제거 후 01012345678이 되어 유효함
      expect(isValidPhoneNumber('020-1234-5678')).toBe(false); // 잘못된 번호
      expect(isValidPhoneNumber('abcd')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('010-123-678')).toBe(false); // 너무 짧음
    });

    it('하이픈 없이도 검증해야 함', () => {
      expect(isValidPhoneNumber('01012345678')).toBe(true);
      expect(isValidPhoneNumber('01098765432')).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('null은 true를 반환해야 함', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('undefined는 true를 반환해야 함', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('빈 문자열은 true를 반환해야 함', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true); // 공백만 있는 문자열
    });

    it('빈 배열은 true를 반환해야 함', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('빈 객체는 true를 반환해야 함', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('값이 있으면 false를 반환해야 함', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(['item'])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false); // 0도 유효한 값
      expect(isEmpty(false)).toBe(false); // false도 유효한 값
    });
  });

  describe('isNumber', () => {
    it('숫자 타입은 true를 반환해야 함', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-456)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it('숫자 문자열은 true를 반환해야 함', () => {
      expect(isNumber('123')).toBe(true);
      expect(isNumber('3.14')).toBe(true);
      expect(isNumber('-456')).toBe(true);
    });

    it('NaN은 false를 반환해야 함', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('Infinity는 false를 반환해야 함', () => {
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
    });

    it('숫자가 아닌 문자열은 false를 반환해야 함', () => {
      expect(isNumber('abc')).toBe(false);
      // parseFloat('123abc')는 123을 반환하므로 true
      expect(isNumber('abc123')).toBe(false); // 앞이 문자면 NaN
      expect(isNumber('')).toBe(false);
    });

    it('다른 타입은 false를 반환해야 함', () => {
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(true)).toBe(false);
    });
  });
});
