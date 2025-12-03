"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Users, DollarSign, FileText, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"

const menuItems = [
  { icon: Home, label: "대시보드", href: "/" },
  { icon: Users, label: "인사관리", href: "/hr" },
  { icon: DollarSign, label: "재무회계", href: "/finance" },
  { icon: FileText, label: "자산관리", href: "/general" },
]

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300",
          open ? "w-64" : "w-0 lg:w-16"
        )}
      >
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

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                !open && "lg:justify-center"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
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
