"use client"

import { useCallback, useState } from "react"
import { Upload, X, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./button"

export interface GalleryImage {
  id?: string
  url: string
  file?: File
  storagePath?: string
}

interface MultiImageUploadProps {
  images: GalleryImage[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export default function MultiImageUpload({
  images,
  onAdd,
  onRemove,
  onReorder,
}: MultiImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/")
      )
      if (files.length > 0) onAdd(files)
    },
    [onAdd]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return (
    <div className="space-y-3">
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id || image.url}
              className="relative group border border-border bg-[#111]/50 overflow-hidden"
            >
              <img
                src={image.url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-[#00ff41]"
                  onClick={() => onReorder(index, index - 1)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-[#00ff41]"
                  onClick={() => onReorder(index, index + 1)}
                  disabled={index === images.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-red-400"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 text-[9px] text-white/70">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center h-28 border border-dashed cursor-pointer transition-colors ${
          dragOver
            ? "border-[#00ff41]/50 bg-[#00ff41]/5"
            : "border-border hover:border-[#00ff41]/30"
        }`}
      >
        <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
        <span className="text-xs text-muted-foreground">Add gallery images</span>
        <span className="text-[10px] text-muted-foreground/60 mt-0.5">
          Drag & drop or click to browse (multiple)
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </label>
    </div>
  )
}
