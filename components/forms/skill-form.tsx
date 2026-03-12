"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { skillSchema, type SkillFormData } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import type { Skill } from "@/lib/types"

interface SkillFormProps {
  defaultValues?: Skill
  onSubmit: (data: SkillFormData) => Promise<void>
  submitLabel?: string
}

export default function SkillForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Skill",
}: SkillFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultValues
      ? {
          category: defaultValues.category,
          name: defaultValues.name,
          proficiency: defaultValues.proficiency,
          order_index: defaultValues.order_index,
        }
      : {
          category: "",
          name: "",
          proficiency: 80,
          order_index: 0,
        },
  })

  async function handleSubmit(data: SkillFormData) {
    setLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  const proficiency = form.watch("proficiency")

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g. Frontend, Backend, DevOps"
            {...form.register("category")}
          />
          {form.formState.errors.category && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Skill Name</Label>
          <Input
            id="name"
            placeholder="e.g. React, Python, AWS"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Proficiency */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label>Proficiency</Label>
            <span className="text-xs text-[#00ff41] tabular-nums font-bold">
              {proficiency}%
            </span>
          </div>
          <Slider
            value={[proficiency]}
            onValueChange={([val]) => form.setValue("proficiency", val)}
            min={0}
            max={100}
            step={5}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground tracking-wider">
            <span>BEGINNER</span>
            <span>INTERMEDIATE</span>
            <span>EXPERT</span>
          </div>
        </div>

        {/* Order Index */}
        <div className="space-y-2">
          <Label htmlFor="order_index">Order</Label>
          <Input
            id="order_index"
            type="number"
            {...form.register("order_index", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
