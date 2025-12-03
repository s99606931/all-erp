"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

/**
 * 애플리케이션 레이아웃 컴포넌트
 *
 * @description
 * 사이드바와 헤더를 포함하는 메인 레이아웃입니다.
 * 사이드바는 토글 가능하며, 모바일에서는 오버레이 방식으로 표시됩니다.
 *
 * 구조:
 * - Sidebar: 왼쪽 네비게이션 메뉴
 * - Header: 상단 헤더 (메뉴 버튼, 테마 토글 등)
 * - Main: 실제 페이지 컨텐츠 영역
 *
 * @param children - 페이지 컨텐츠
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // 사이드바 토글 핸들러 (useCallback으로 메모이제이션하여 불필요한 재렌더링 방지)
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <Header onMenuClick={handleSidebarToggle} />

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
