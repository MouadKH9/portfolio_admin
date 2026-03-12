"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { experienceSchema, type ExperienceFormData } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import type { Experience } from "@/lib/types"

interface ExperienceFormProps {
  defaultValues?: Experience
  onSubmit: (data: ExperienceFormData) => Promise<void>
  submitLabel?: string
}

export default function ExperienceForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Experience",
}: ExperienceFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues
      ? {
          company: defaultValues.company,
          position: defaultValues.position,
          description: defaultValues.description || "",
          start_date: defaultValues.start_date,
          end_date: defaultValues.end_date || "",
          current: defaultValues.current,
          order_index: defaultValues.order_index,
        }
      : {
          company: "",
          position: "",
          description: "",
          start_date: "",
          end_date: "",
          current: false,
          order_index: 0,
        },
  })

  const isCurrent = form.watch("current")

  async function handleSubmit(data: ExperienceFormData) {
    setLoading(true)
    try {
      if (data.current) data.end_date = ""
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Company name"
            {...form.register("company")}
          />
          {form.formState.errors.company && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.company.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            placeholder="Job title"
            {...form.register("position")}
          />
          {form.formState.errors.position && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.position.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What did you do there..."
            rows={3}
            {...form.register("description")}
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            {...form.register("start_date")}
          />
          {form.formState.errors.start_date && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.start_date.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            disabled={isCurrent}
            {...form.register("end_date")}
            className={isCurrent ? "opacity-30" : ""}
          />
        </div>

        {/* Current */}
        <div className="flex items-center gap-3 md:col-span-2">
          <Switch
            checked={isCurrent}
            onCheckedChange={(checked) => form.setValue("current", checked)}
          />
          <Label className="cursor-pointer">Currently working here</Label>
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
