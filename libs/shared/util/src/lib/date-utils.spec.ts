import {
  getCurrentIsoDate,
  formatDate,
  formatDateTime,
  getDaysDiff,
  addDays,
} from './date-utils';

describe('Date Utils', () => {
  describe('getCurrentIsoDate', () => {
    it('ISO 8601 형식의 현재 날짜 문자열을 반환해야 함', () => {
      const result = getCurrentIsoDate();
      
      // ISO 8601 형식 검증 (YYYY-MM-DDTHH:mm:ss.sssZ)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // 유효한 날짜인지 확인
      expect(new Date(result).toString()).not.toBe('Invalid Date');
    });
  });

  describe('formatDate', () => {
    it('Date 객체를 YYYY-MM-DD 형식으로 변환해야 함', () => {
      const date = new Date('2025-12-03T10:30:00');
      const result = formatDate(date);
      
      expect(result).toBe('2025-12-03');
    });

    it('날짜 문자열을 YYYY-MM-DD 형식으로 변환해야 함', () => {
      const result = formatDate('2025-01-15');
      
      expect(result).toBe('2025-01-15');
    });

    it('한 자리 월과 일을 두 자리로 패딩해야 함', () => {
      const date = new Date('2025-01-05T10:30:00');
      const result = formatDate(date);
      
      expect(result).toBe('2025-01-05');
    });
  });

  describe('formatDateTime', () => {
    it('Date 객체를 YYYY-MM-DD HH:mm:ss 형식으로 변환해야 함', () => {
      const date = new Date('2025-12-03T14:30:45');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/2025-12-03 \d{2}:30:45/);
    });

    it('날짜 문자열을 YYYY-MM-DD HH:mm:ss 형식으로 변환해야 함', () => {
      const result = formatDateTime('2025-01-15T09:05:30');
      
      expect(result).toMatch(/2025-01-15 \d{2}:05:30/);
    });

    it('시/분/초를 두 자리로 패딩해야 함', () => {
      const date = new Date('2025-01-05T01:02:03');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/2025-01-05 \d{2}:02:03/);
    });
  });

  describe('getDaysDiff', () => {
    it('두 날짜 사이의 일수 차이를 계산해야 함', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-10');
      const result = getDaysDiff(start, end);
      
      expect(result).toBe(9);
    });

    it('날짜 문자열로도 일수 차이를 계산해야 함', () => {
      const result = getDaysDiff('2025-01-01', '2025-01-15');
      
      expect(result).toBe(14);
    });

    it('시간을 무시하고 날짜만 비교해야 함', () => {
      const start = new Date('2025-01-01T23:59:59');
      const end = new Date('2025-01-02T00:00:01');
      const result = getDaysDiff(start, end);
      
      expect(result).toBe(1);
    });

    it('음수가 아닌 절대값을 반환해야 함', () => {
      const start = new Date('2025-01-10');
      const end = new Date('2025-01-01');
      const result = getDaysDiff(start, end);
      
      expect(result).toBe(9);
    });
  });

  describe('addDays', () => {
    it('날짜에 지정된 일수를 더해야 함', () => {
      const date = new Date('2025-01-01');
      const result = addDays(date, 10);
      
      expect(formatDate(result)).toBe('2025-01-11');
    });

    it('음수 일수를 빼야 함', () => {
      const date = new Date('2025-01-15');
      const result = addDays(date, -5);
      
      expect(formatDate(result)).toBe('2025-01-10');
    });

    it('날짜 문자열에도 일수를 더해야 함', () => {
      const result = addDays('2025-12-25', 7);
      
      expect(formatDate(result)).toBe('2026-01-01');
    });

    it('월을 넘어가는 계산을 올바르게 해야 함', () => {
      const date = new Date('2025-01-31');
      const result = addDays(date, 1);
      
      expect(formatDate(result)).toBe('2025-02-01');
    });
  });
});
