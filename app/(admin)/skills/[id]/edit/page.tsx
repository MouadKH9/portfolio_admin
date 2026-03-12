import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditSkillClient from "./client"

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: skill, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !skill) notFound()

  return <EditSkillClient skill={skill} />
}
