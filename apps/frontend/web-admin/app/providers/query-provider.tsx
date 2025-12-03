"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * React Query 제공자 컴포넌트
 *
 * @description
 * TanStack Query(React Query)를 애플리케이션에 제공합니다.
 * 서버 상태 관리, 캐싱, 동기화 등의 기능을 처리합니다.
 *
 * 기본 설정:
 * - staleTime: 1분 (데이터가 오래된 것으로 간주되기까지의 시간)
 * - retry: 1회 (요청 실패 시 재시도 횟수)
 * - refetchOnWindowFocus: false (윈도우 포커스 시 자동 재조회 비활성화)
 *
 * @param children - 자식 컴포넌트
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // QueryClient 인스턴스는 컴포넌트 생명주기 동안 한 번만 생성됩니다
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분 - 데이터 신선도 유지 시간
        retry: 1, // 실패 시 1회만 재시도
        refetchOnWindowFocus: false, // 윈도우 포커스 시 재조회 비활성화 (UX 개선)
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 보이는 디버깅 도구 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
