"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { projectSchema, type ProjectFormData } from "@/lib/validations"
import type { Project, ProjectImage } from "@/lib/types"

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function getProject(id: string): Promise<Project> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getProjectImages(
  projectId: string
): Promise<ProjectImage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createProject(
  formData: ProjectFormData
): Promise<string> {
  const supabase = await createClient()
  const validated = projectSchema.parse(formData)
  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...validated,
      long_description: validated.long_description || null,
      github_url: validated.github_url || null,
      live_url: validated.live_url || null,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
  return data.id
}

export async function updateProject(id: string, formData: ProjectFormData) {
  const supabase = await createClient()
  const validated = projectSchema.parse(formData)
  const { error } = await supabase
    .from("projects")
    .update({
      ...validated,
      long_description: validated.long_description || null,
      github_url: validated.github_url || null,
      live_url: validated.live_url || null,
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
}

export async function updateProjectThumbnail(
  id: string,
  thumbnailUrl: string | null
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("projects")
    .update({ thumbnail_url: thumbnailUrl })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
}

export async function addProjectGalleryImages(
  projectId: string,
  images: { image_url: string; storage_path: string; order_index: number }[]
) {
  if (images.length === 0) return
  const supabase = await createClient()
  const rows = images.map((img) => ({ project_id: projectId, ...img }))
  const { error } = await supabase.from("project_images").insert(rows)
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
}

export async function removeProjectGalleryImages(ids: string[]) {
  if (ids.length === 0) return
  const supabase = await createClient()
  const { error } = await supabase
    .from("project_images")
    .delete()
    .in("id", ids)
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
}

export async function updateGalleryOrder(
  items: { id: string; order_index: number }[]
) {
  const supabase = await createClient()
  for (const item of items) {
    const { error } = await supabase
      .from("project_images")
      .update({ order_index: item.order_index })
      .eq("id", item.id)
    if (error) throw new Error(error.message)
  }
  revalidatePath("/projects")
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  // project_images are cascade deleted by FK
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/projects")
}

export async function reorderProjects(
  items: { id: string; order_index: number }[]
) {
  const supabase = await createClient()
  for (const item of items) {
    const { error } = await supabase
      .from("projects")
      .update({ order_index: item.order_index })
      .eq("id", item.id)
    if (error) throw new Error(error.message)
  }
  revalidatePath("/projects")
}
