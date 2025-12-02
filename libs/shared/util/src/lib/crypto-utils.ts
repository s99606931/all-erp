/**
 * 암호화 유틸리티
 * 주의: bcryptjs 또는 bcrypt 패키지가 필요합니다.
 */
import * as bcrypt from 'bcryptjs';

/**
 * 비밀번호 해싱
 * @param password 평문 비밀번호
 * @param saltRounds 솔트 라운드 (기본값 10)
 */
export async function hashPassword(password: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * 비밀번호 검증
 * @param password 평문 비밀번호
 * @param hash 해시된 비밀번호
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Base64 인코딩
 * @param str 입력 문자열
 */
export function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64');
}

/**
 * Base64 디코딩
 * @param str Base64 문자열
 */
export function base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}
