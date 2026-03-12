"use client"

import { useRouter } from "next/navigation"
import SkillForm from "@/components/forms/skill-form"
import { createSkill } from "@/lib/actions/skills"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { SkillFormData } from "@/lib/validations"

export default function NewSkillPage() {
  const router = useRouter()

  async function handleSubmit(data: SkillFormData) {
    try {
      await createSkill(data)
      toast.success("Skill created")
      router.push("/skills")
    } catch {
      toast.error("Failed to create skill")
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/skills"
        className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground tracking-wider uppercase transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to skills
      </Link>

      <div className="border border-border bg-card/30">
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="text-[9px] text-muted-foreground ml-2 tracking-wider">
              ~/skills/new
            </span>
          </div>
        </div>
        <div className="p-6">
          <SkillForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
