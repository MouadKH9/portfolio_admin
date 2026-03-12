"use client"

import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/skills": "Skills",
  "/experience": "Experience",
  "/messages": "Messages",
}

function getTitle(pathname: string) {
  if (pathname.includes("/projects/new")) return "New Project"
  if (pathname.includes("/projects/") && pathname.includes("/edit"))
    return "Edit Project"
  if (pathname.includes("/skills/new")) return "New Skill"
  if (pathname.includes("/skills/") && pathname.includes("/edit"))
    return "Edit Skill"
  if (pathname.includes("/experience/new")) return "New Experience"
  if (pathname.includes("/experience/") && pathname.includes("/edit"))
    return "Edit Experience"
  return titles[pathname] || "Admin"
}

export default function Header() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-border bg-[#06090c]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-[#00ff41] animate-pulse-dot" />
        <h1 className="font-[var(--font-display)] text-sm font-bold tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-muted-foreground tracking-wider tabular-nums">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </header>
  )
}
