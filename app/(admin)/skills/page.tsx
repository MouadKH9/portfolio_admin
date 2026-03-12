import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Skill } from "@/lib/types"
import SkillActions from "./actions"

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true })

  const grouped = (skills as Skill[] | null)?.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-[#00d4ff]" />
          <p className="text-[10px] text-muted-foreground tracking-wider">
            {skills?.length ?? 0} skills
          </p>
        </div>
        <Link href="/skills/new">
          <Button size="sm">
            <Plus className="w-3 h-3" />
            New Skill
          </Button>
        </Link>
      </div>

      {/* Grouped Skills */}
      {grouped && Object.keys(grouped).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([category, categorySkills], i) => (
            <div
              key={category}
              className="border border-border bg-card/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              {/* Category header */}
              <div className="px-5 py-3 border-b border-border/50 bg-secondary/20">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan">{category}</Badge>
                  <span className="text-[9px] text-muted-foreground tracking-wider">
                    {categorySkills.length} skills
                  </span>
                </div>
              </div>

              {/* Skills in category */}
              <div className="divide-y divide-border/30">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="px-5 py-3 hover:bg-secondary/20 transition-colors scanline-hover"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">{skill.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#00ff41] tabular-nums font-bold">
                          {skill.proficiency}%
                        </span>
                        <SkillActions skill={skill} />
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-border/50 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff41] transition-all duration-700"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border bg-card/30 px-5 py-16 text-center">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            No skills yet
          </p>
          <Link href="/skills/new" className="inline-block mt-3">
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3" />
              Create first skill
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
