"use client"

import { useRouter } from "next/navigation"
import ExperienceForm from "@/components/forms/experience-form"
import { createExperience } from "@/lib/actions/experience"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ExperienceFormData } from "@/lib/validations"

export default function NewExperiencePage() {
  const router = useRouter()

  async function handleSubmit(data: ExperienceFormData) {
    try {
      await createExperience(data)
      toast.success("Experience created")
      router.push("/experience")
    } catch {
      toast.error("Failed to create experience")
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/experience"
        className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground tracking-wider uppercase transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to experience
      </Link>

      <div className="border border-border bg-card/30">
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="text-[9px] text-muted-foreground ml-2 tracking-wider">
              ~/experience/new
            </span>
          </div>
        </div>
        <div className="p-6">
          <ExperienceForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
