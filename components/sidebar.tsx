"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  Briefcase,
  MessageSquare,
  LogOut,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/skills", label: "Skills", icon: Zap },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/messages", label: "Messages", icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-[#080b0f] transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
        <div className="w-7 h-7 flex items-center justify-center border border-[#00ff41]/30 bg-[#00ff41]/5">
          <Terminal className="w-3.5 h-3.5 text-[#00ff41]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
              Admin
            </span>
            <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
              Portfolio
            </span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 flex items-center justify-center bg-card border border-border hover:border-[#00ff41]/30 transition-colors z-50 cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {!collapsed && (
          <div className="px-2 mb-3">
            <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60">
              Navigation
            </span>
          </div>
        )}
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 text-xs transition-all duration-200 relative",
                collapsed && "justify-center px-0",
                isActive
                  ? "text-[#00ff41] bg-[#00ff41]/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#00ff41]" />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive && "drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]"
                )}
              />
              {!collapsed && (
                <span className="tracking-wider uppercase font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-[#ff3b3b] transition-colors w-full cursor-pointer",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <span className="tracking-wider uppercase">Sign Out</span>
          )}
        </button>
      </div>
    </aside>
  )
}
