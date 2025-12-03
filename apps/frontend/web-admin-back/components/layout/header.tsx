"use client"

import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"

interface HeaderProps {
  /** 메뉴 버튼 클릭 핸들러 */
  onMenuClick: () => void
}

/**
 * 헤더 컴포넌트
 *
 * @description
 * 애플리케이션 상단 헤더 바입니다.
 * 메뉴 토글 버튼과 테마 전환 버튼을 제공합니다.
 *
 * 기능:
 * - 사이드바 열기/닫기
 * - 다크모드/라이트모드 전환
 * - 사용자 정보 표시 (현재 "관리자"로 고정)
 *
 * @param onMenuClick - 메뉴 버튼 클릭 시 실행될 함수
 */
export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b bg-card h-16 flex items-center justify-between px-6">
      {/* 메뉴 토글 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="메뉴 토글"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* 우측 영역: 테마 토글 + 사용자 정보 */}
      <div className="flex items-center gap-4">
        {/* 테마 전환 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* 사용자 정보 */}
        <div className="text-sm">
          <p className="font-medium">관리자</p>
        </div>
      </div>
    </header>
  )
}
