"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/actions/auth"
import { Loader2, Terminal, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg relative">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00ff41]/[0.02] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00d4ff]/[0.02] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center border border-[#00ff41]/20 bg-[#00ff41]/5 mb-4">
            <Terminal className="w-5 h-5 text-[#00ff41]" />
          </div>
          <h1 className="font-[var(--font-display)] text-xl font-bold tracking-tight">
            Admin Access
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
            Portfolio Control Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="border border-border bg-card/50 backdrop-blur-sm">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="text-[9px] text-muted-foreground ml-2 tracking-wider">
              ~/auth/login
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#ff3b3b]/5 border border-[#ff3b3b]/20 text-[11px] text-[#ff3b3b]">
                <Lock className="w-3 h-3 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Authenticate
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[9px] text-muted-foreground/40 mt-6 tracking-wider">
          AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  )
}
