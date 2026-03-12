"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/delete-dialog"
import { deleteProject } from "@/lib/actions/projects"
import { deleteProjectFolder } from "@/lib/supabase/storage"
import { toast } from "sonner"
import type { Project } from "@/lib/types"
import Link from "next/link"

export default function ProjectActions({ project }: { project: Project }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      await deleteProjectFolder(project.id)
      await deleteProject(project.id)
      toast.success("Project deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete project")
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Link href={`/projects/${project.id}/edit`}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil className="w-3 h-3" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-[#ff3b3b]"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title={`Delete "${project.title}"?`}
        description="This will permanently remove this project from your portfolio."
      />
    </>
  )
}
