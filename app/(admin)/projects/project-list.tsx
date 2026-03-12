"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, Plus } from "lucide-react"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { reorderProjects } from "@/lib/actions/projects"
import { toast } from "sonner"
import type { Project } from "@/lib/types"
import ProjectActions from "./actions"

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects)
  const [isPending, startTransition] = useTransition()

  function handleReorder(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return

    const updated = [...items]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    setItems(updated)

    const payload = updated.map((item, i) => ({
      id: item.id,
      order_index: i,
    }))

    startTransition(async () => {
      try {
        await reorderProjects(payload)
      } catch {
        setItems(items)
        toast.error("Failed to reorder projects")
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
          No projects yet
        </p>
        <Link href="/projects/new" className="inline-block mt-3">
          <Button variant="outline" size="sm">
            <Plus className="w-3 h-3" />
            Create first project
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/30 text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
        <span className="w-14 text-center">Order</span>
        <span>Title</span>
        <span>Technologies</span>
        <span className="text-center">Featured</span>
        <span className="text-center">Links</span>
        <span className="text-center">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {items.map((project, i) => (
          <div
            key={project.id}
            className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-secondary/20 transition-colors scanline-hover"
          >
            {/* Order buttons */}
            <div className="w-14 flex items-center justify-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === 0 || isPending}
                onClick={() => handleReorder(i, "up")}
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === items.length - 1 || isPending}
                onClick={() => handleReorder(i, "down")}
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>

            {/* Title & description */}
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{project.title}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-[8px]">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="outline" className="text-[8px]">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>

            {/* Featured */}
            <div className="flex justify-center w-20">
              {project.featured ? (
                <Badge variant="default">Yes</Badge>
              ) : (
                <Badge variant="secondary">No</Badge>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-2 justify-center w-20">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="w-20 flex justify-center">
              <ProjectActions project={project} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
