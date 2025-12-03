import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 클래스명을 병합하는 유틸리티 함수
 *
 * @description
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 Tailwind CSS 클래스를 병합합니다.
 * 이를 통해 조건부 스타일링과 Tailwind 클래스 우선순위 문제를 해결합니다.
 *
 * @param inputs - 병합할 클래스명 배열 (문자열, 객체, 배열 등)
 * @returns 병합된 클래스명 문자열
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500')
 * cn('px-2', 'px-4') // 'px-4' (나중 값이 우선)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
