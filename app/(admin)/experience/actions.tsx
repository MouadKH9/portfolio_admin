"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/delete-dialog"
import { deleteExperience } from "@/lib/actions/experience"
import { toast } from "sonner"
import type { Experience } from "@/lib/types"
import Link from "next/link"

export default function ExperienceActions({
  experience,
}: {
  experience: Experience
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      await deleteExperience(experience.id)
      toast.success("Experience deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete experience")
    }
  }

  return (
    <>
      <div className="flex items-center gap-0.5 shrink-0">
        <Link href={`/experience/${experience.id}/edit`}>
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
        title={`Delete "${experience.position} at ${experience.company}"?`}
        description="This will permanently remove this experience entry."
      />
    </>
  )
}
