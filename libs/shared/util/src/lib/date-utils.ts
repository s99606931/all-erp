/**
 * 날짜 처리 유틸리티
 */

/**
 * 현재 날짜를 ISO 문자열로 반환
 */
export function getCurrentIsoDate(): string {
  return new Date().toISOString();
}

/**
 * 날짜 객체를 YYYY-MM-DD 형식의 문자열로 변환
 * @param date Date 객체 또는 날짜 문자열
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 날짜 객체를 YYYY-MM-DD HH:mm:ss 형식의 문자열로 변환
 * @param date Date 객체 또는 날짜 문자열
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * 두 날짜 사이의 일수 차이 계산
 * @param startDate 시작일
 * @param endDate 종료일
 */
export function getDaysDiff(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 시간을 제외하고 날짜만 비교하기 위해 자정으로 설정
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
}

/**
 * 특정 날짜에 일수를 더함
 * @param date 기준일
 * @param days 더할 일수
 */
export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
