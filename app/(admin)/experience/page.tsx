import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Experience } from "@/lib/types"
import ExperienceActions from "./actions"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

export default async function ExperiencePage() {
  const supabase = await createClient()
  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: true })

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-[#00ff41]" />
          <p className="text-[10px] text-muted-foreground tracking-wider">
            {experience?.length ?? 0} entries
          </p>
        </div>
        <Link href="/experience/new">
          <Button size="sm">
            <Plus className="w-3 h-3" />
            New Experience
          </Button>
        </Link>
      </div>

      {/* Timeline */}
      {experience && experience.length > 0 ? (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#00ff41]/30 via-border/20 to-transparent" />

          <div className="space-y-4">
            {(experience as Experience[]).map((item, i) => (
              <div
                key={item.id}
                className="relative pl-12 animate-fade-in-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-4 top-5 -translate-x-1/2">
                  <div
                    className={`w-2.5 h-2.5 border-2 ${
                      item.current
                        ? "border-[#00ff41] bg-[#00ff41]/20"
                        : "border-border bg-background"
                    }`}
                  >
                    {item.current && (
                      <div className="absolute inset-0 border border-[#00ff41]/30 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="border border-border bg-card/30 hover:border-[#00ff41]/20 transition-all scanline-hover">
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xs font-bold">{item.position}</h3>
                          {item.current && (
                            <Badge variant="default">Current</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-[#00d4ff]/80 mb-1">
                          {item.company}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums tracking-wider">
                          {formatDate(item.start_date)} —{" "}
                          {item.current ? (
                            <span className="text-[#00ff41]">Present</span>
                          ) : (
                            formatDate(item.end_date || "")
                          )}
                        </p>
                        {item.description && (
                          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ExperienceActions experience={item} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-border bg-card/30 px-5 py-16 text-center">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            No experience entries yet
          </p>
          <Link href="/experience/new" className="inline-block mt-3">
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3" />
              Add experience
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
