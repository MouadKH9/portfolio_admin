"use client"

import { useCallback, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "./button"

interface ImageUploadProps {
  value?: string | null
  onChange: (file: File) => void
  onRemove: () => void
  label?: string
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return
      const url = URL.createObjectURL(file)
      setPreview(url)
      onChange(file)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    onRemove()
  }, [onRemove])

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative group border border-border bg-[#111]/50 overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-48 border border-dashed cursor-pointer transition-colors ${
            dragOver
              ? "border-[#00ff41]/50 bg-[#00ff41]/5"
              : "border-border hover:border-[#00ff41]/30"
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-[10px] text-muted-foreground/60 mt-1">
            Drag & drop or click to browse
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </label>
      )}
    </div>
  )
}
