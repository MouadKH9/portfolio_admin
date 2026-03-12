import { createClient } from "@/lib/supabase/server"
import { MessageSquare } from "lucide-react"
import type { ContactMessage } from "@/lib/types"
import MessageActions from "./actions"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from("contact_form")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 bg-[#00d4ff]" />
        <p className="text-[10px] text-muted-foreground tracking-wider">
          {messages?.length ?? 0} messages
        </p>
      </div>

      {/* Messages */}
      {messages && messages.length > 0 ? (
        <div className="space-y-3">
          {(messages as ContactMessage[]).map((msg, i) => (
            <div
              key={msg.id}
              className="border border-border bg-card/30 hover:border-[#00d4ff]/20 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-[#00d4ff]">
                        {msg.email}
                      </span>
                      <span className="text-[9px] text-muted-foreground/50 tabular-nums tracking-wider">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                  <MessageActions message={msg} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border bg-card/30 px-5 py-16 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            No messages yet
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">
            Messages from your portfolio contact form will appear here
          </p>
        </div>
      )}
    </div>
  )
}
