"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter...",
}: TagInputProps) {
  const [input, setInput] = useState("")

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      const tag = input.trim()
      if (tag && !value.includes(tag)) {
        onChange([...value, tag])
      }
      setInput("")
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 min-h-[38px] bg-[#111820] border border-border focus-within:border-[#00ff41] focus-within:shadow-[0_0_0_1px_rgba(0,255,65,0.15),0_0_20px_rgba(0,255,65,0.05)] transition-all">
      {value.map((tag) => (
        <Badge key={tag} variant="default" className="gap-1 cursor-default">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-0.5 hover:text-[#ff3b3b] transition-colors cursor-pointer"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-6 focus:shadow-none focus:ring-0"
        style={{ boxShadow: "none" }}
      />
    </div>
  )
}
