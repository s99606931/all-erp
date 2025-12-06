/**
 * 클래스명을 조건부로 결합하는 유틸리티 함수
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 날짜를 포맷팅하는 함수
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 숫자를 통화 형식으로 포맷팅
 */
export function formatCurrency(amount: number, currency = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 숫자를 천 단위로 구분
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}
