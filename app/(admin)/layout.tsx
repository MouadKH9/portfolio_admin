import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-[var(--sidebar-width)] transition-all duration-300">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
