"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMessages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_form")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("contact_form").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/messages")
}
