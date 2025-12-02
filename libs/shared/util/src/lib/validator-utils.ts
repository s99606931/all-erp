/**
 * 데이터 검증 유틸리티
 */

/**
 * 이메일 형식 검증
 * @param email 이메일 주소
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * 전화번호 형식 검증 (한국 기준)
 * @param phone 전화번호 (010-1234-5678 또는 01012345678)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // 하이픈 제거 후 검사
  const cleanPhone = phone.replace(/-/g, '');
  const phoneRegex = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * 값이 비어있는지 확인 (null, undefined, empty string, empty array, empty object)
 * @param value 검사할 값
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value as object).length === 0) return true;
  return false;
}

/**
 * 숫자인지 확인
 * @param value 검사할 값
 */
export function isNumber(value: unknown): boolean {
  if (typeof value === 'number') return isFinite(value);
  if (typeof value === 'string') return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  return false;
}
