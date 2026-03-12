"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { experienceSchema, type ExperienceFormData } from "@/lib/validations"

export async function getExperiences() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function getExperience(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createExperience(formData: ExperienceFormData) {
  const supabase = await createClient()
  const validated = experienceSchema.parse(formData)
  const { error } = await supabase.from("experience").insert({
    ...validated,
    description: validated.description || null,
    end_date: validated.end_date || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/experience")
}

export async function updateExperience(
  id: string,
  formData: ExperienceFormData
) {
  const supabase = await createClient()
  const validated = experienceSchema.parse(formData)
  const { error } = await supabase
    .from("experience")
    .update({
      ...validated,
      description: validated.description || null,
      end_date: validated.end_date || null,
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/experience")
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("experience").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/experience")
}
