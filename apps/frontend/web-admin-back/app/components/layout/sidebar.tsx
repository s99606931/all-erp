"use client"

import Link from "next/link"
import { Home, Users, DollarSign, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "대시보드", href: "/" },
  { icon: Users, label: "인사관리", href: "/hr" },
  { icon: DollarSign, label: "재무회계", href: "/finance" },
  { icon: FileText, label: "자산관리", href: "/general" },
]

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside className={cn(
      "h-full bg-slate-900 dark:bg-slate-950 border-r border-slate-700 transition-all duration-300 flex-shrink-0",
      open ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-slate-700">
        <h1 className={cn(
          "font-bold text-xl text-white transition-opacity duration-300",
          !open && "opacity-0"
        )}>
          All-ERP
        </h1>
      </div>
      <nav className="space-y-1 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {open && <span className="transition-opacity duration-300">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
