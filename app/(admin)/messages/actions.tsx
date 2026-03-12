"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/delete-dialog"
import { deleteMessage } from "@/lib/actions/messages"
import { toast } from "sonner"
import type { ContactMessage } from "@/lib/types"

export default function MessageActions({
  message,
}: {
  message: ContactMessage
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      await deleteMessage(message.id)
      toast.success("Message deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete message")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 hover:text-[#ff3b3b]"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete this message?"
        description={`Message from ${message.email} will be permanently deleted.`}
      />
    </>
  )
}
