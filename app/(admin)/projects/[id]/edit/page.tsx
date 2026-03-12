import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditProjectClient from "./client"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [projectResult, imagesResult] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("order_index", { ascending: true }),
  ])

  if (projectResult.error || !projectResult.data) notFound()

  return (
    <EditProjectClient
      project={projectResult.data}
      galleryImages={imagesResult.data || []}
    />
  )
}
