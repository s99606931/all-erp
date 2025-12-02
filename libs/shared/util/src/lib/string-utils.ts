/**
 * 문자열 조작 유틸리티
 */

/**
 * 지정된 길이의 랜덤 문자열 생성 (영문 대소문자 + 숫자)
 * @param length 생성할 문자열 길이
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 문자열의 첫 글자를 대문자로 변환
 * @param str 입력 문자열
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 스네이크 케이스(snake_case)를 카멜 케이스(camelCase)로 변환
 * @param str 입력 문자열
 */
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

/**
 * 카멜 케이스(camelCase)를 스네이크 케이스(snake_case)로 변환
 * @param str 입력 문자열
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 개인정보 마스킹 (이름 등)
 * @param str 입력 문자열
 * @param visibleCount 앞부분 보여줄 글자 수 (기본값 1)
 */
export function maskString(str: string, visibleCount = 1): string {
  if (!str || str.length <= visibleCount) return str;
  return str.substring(0, visibleCount) + '*'.repeat(str.length - visibleCount);
}

/**
 * 이메일 마스킹 (ab***@domain.com)
 * @param email 이메일 주소
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }
  
  return `${local.substring(0, 2)}***@${domain}`;
}
