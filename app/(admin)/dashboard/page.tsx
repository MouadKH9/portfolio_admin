import { createClient } from "@/lib/supabase/server"
import {
  FolderKanban,
  Zap,
  Briefcase,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: skillCount },
    { count: experienceCount },
    { count: messageCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("experience").select("*", { count: "exact", head: true }),
    supabase.from("contact_form").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_form")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: "Projects",
      count: projectCount ?? 0,
      icon: FolderKanban,
      href: "/projects",
      color: "#00ff41",
    },
    {
      label: "Skills",
      count: skillCount ?? 0,
      icon: Zap,
      href: "/skills",
      color: "#00d4ff",
    },
    {
      label: "Experience",
      count: experienceCount ?? 0,
      icon: Briefcase,
      href: "/experience",
      color: "#00ff41",
    },
    {
      label: "Messages",
      count: messageCount ?? 0,
      icon: MessageSquare,
      href: "/messages",
      color: "#00d4ff",
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-border bg-card/50 p-5 transition-all duration-300 hover:border-[color:var(--hover-color)] hover:glow-green scanline-hover animate-fade-in-up"
            style={
              {
                animationDelay: `${i * 75}ms`,
                "--hover-color": `${stat.color}40`,
              } as React.CSSProperties
            }
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-8 h-8 flex items-center justify-center border bg-opacity-5"
                style={{
                  borderColor: `${stat.color}30`,
                  backgroundColor: `${stat.color}08`,
                }}
              >
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: stat.color }}
                />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div
              className="text-2xl font-bold font-[var(--font-display)] mb-1"
              style={{ color: stat.color }}
            >
              {stat.count}
            </div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="animate-fade-in-up delay-375">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-[#00d4ff]" />
            <h2 className="text-xs font-bold tracking-wider uppercase">
              Recent Messages
            </h2>
          </div>
          <Link
            href="/messages"
            className="text-[10px] text-muted-foreground hover:text-[#00d4ff] tracking-wider uppercase transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="border border-border bg-card/30">
          {recentMessages && recentMessages.length > 0 ? (
            <div className="divide-y divide-border">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="px-5 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#00d4ff] mb-1">
                        {msg.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </p>
                    </div>
                    <span className="text-[9px] text-muted-foreground/60 tracking-wider whitespace-nowrap tabular-nums">
                      {new Date(msg.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <MessageSquare className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                No messages yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
