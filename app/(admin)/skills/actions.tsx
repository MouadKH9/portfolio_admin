"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/delete-dialog"
import { deleteSkill } from "@/lib/actions/skills"
import { toast } from "sonner"
import type { Skill } from "@/lib/types"
import Link from "next/link"

export default function SkillActions({ skill }: { skill: Skill }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      await deleteSkill(skill.id)
      toast.success("Skill deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete skill")
    }
  }

  return (
    <>
      <div className="flex items-center gap-0.5">
        <Link href={`/skills/${skill.id}/edit`}>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Pencil className="w-2.5 h-2.5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-[#ff3b3b]"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="w-2.5 h-2.5" />
        </Button>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title={`Delete "${skill.name}"?`}
        description="This will permanently remove this skill."
      />
    </>
  )
}
