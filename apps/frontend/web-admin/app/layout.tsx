import { TooltipProvider } from '@/components/ui/tooltip';

import './global.css';
import { ThemeProvider } from './providers/theme-provider';
import { QueryProvider } from './providers/query-provider';

/** 애플리케이션 메타데이터 */
export const metadata = {
  title: 'All-ERP 관리자',
  description: '통합 ERP 관리 시스템',
};

/**
 * 루트 레이아웃 컴포넌트
 *
 * @description
 * 애플리케이션의 최상위 레이아웃입니다.
 * 모든 페이지에 공통으로 적용되는 설정과 프로바이더를 포함합니다.
 *
 * 제공 기능:
 * - 테마 관리 (다크/라이트 모드)
 * - React Query 상태 관리
 * - 전역 스타일 적용
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
