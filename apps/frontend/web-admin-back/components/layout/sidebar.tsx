"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Users, DollarSign, FileText } from "lucide-react"
import { cn } from "../../lib/utils"

/** 사이드바 메뉴 아이템 목록 */
const MENU_ITEMS = [
  { icon: Home, label: "대시보드", href: "/" },
  { icon: Users, label: "인사관리", href: "/hr" },
  { icon: DollarSign, label: "재무회계", href: "/finance" },
  { icon: FileText, label: "자산관리", href: "/general" },
] as const

interface SidebarProps {
  /** 사이드바 열림/닫힘 상태 */
  open: boolean
  /** 사이드바 토글 핸들러 */
  onToggle: () => void
}

/**
 * 사이드바 컴포넌트
 *
 * @description
 * 애플리케이션의 주요 네비게이션 메뉴를 제공하는 사이드바입니다.
 *
 * 기능:
 * - 반응형 디자인 (모바일에서는 오버레이, 데스크톱에서는 고정)
 * - 토글 가능한 열림/닫힘 상태
 * - 닫힌 상태에서는 아이콘만 표시 (데스크톱)
 *
 * 메뉴 항목:
 * - 대시보드 (/)
 * - 인사관리 (/hr)
 * - 재무회계 (/finance)
 * - 자산관리 (/general)
 *
 * @param open - 사이드바 열림 여부
 * @param onToggle - 사이드바 토글 함수
 */
export function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {/* 모바일 오버레이 (사이드바가 열려있을 때만 표시) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-label="사이드바 닫기"
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300",
          open ? "w-64" : "w-0 lg:w-16"
        )}
      >
        {/* 로고 영역 */}
        <div className="p-4">
          <h1
            className={cn(
              "font-bold text-xl transition-opacity",
              open ? "opacity-100" : "opacity-0 lg:opacity-0"
            )}
          >
            All-ERP
          </h1>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-1 px-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                !open && "lg:justify-center"
              )}
              aria-label={item.label}
            >
              {/* 메뉴 아이콘 */}
              <item.icon className="w-5 h-5 flex-shrink-0" />

              {/* 메뉴 라벨 (열림 상태에서만 표시) */}
              <span
                className={cn(
                  "transition-opacity",
                  open ? "opacity-100" : "opacity-0 lg:opacity-0 absolute"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
