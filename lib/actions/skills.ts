"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { skillSchema, type SkillFormData } from "@/lib/validations"

export async function getSkills() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function getSkill(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createSkill(formData: SkillFormData) {
  const supabase = await createClient()
  const validated = skillSchema.parse(formData)
  const { error } = await supabase.from("skills").insert(validated)
  if (error) throw new Error(error.message)
  revalidatePath("/skills")
}

export async function updateSkill(id: string, formData: SkillFormData) {
  const supabase = await createClient()
  const validated = skillSchema.parse(formData)
  const { error } = await supabase
    .from("skills")
    .update(validated)
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/skills")
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/skills")
}
