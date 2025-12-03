"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 테마(다크모드/라이트모드) 제공자 컴포넌트
 *
 * @description
 * next-themes 라이브러리를 래핑하여 애플리케이션 전체에 테마 기능을 제공합니다.
 * 시스템 테마 자동 감지, 로컬 스토리지 저장 등의 기능을 포함합니다.
 *
 * @param children - 자식 컴포넌트
 * @param props - NextThemesProvider에 전달될 추가 속성
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
