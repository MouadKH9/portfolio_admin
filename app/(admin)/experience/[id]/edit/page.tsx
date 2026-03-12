import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditExperienceClient from "./client"

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: experience, error } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !experience) notFound()

  return <EditExperienceClient experience={experience} />
}
