import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Project } from "@/lib/types"
import ProjectList from "./project-list"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true })

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-[#00ff41]" />
          <p className="text-[10px] text-muted-foreground tracking-wider">
            {projects?.length ?? 0} projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm">
            <Plus className="w-3 h-3" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="border border-border bg-card/30 overflow-hidden">
        <ProjectList projects={(projects as Project[]) ?? []} />
      </div>
    </div>
  )
}
