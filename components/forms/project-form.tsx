"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectFormData } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import TagInput from "@/components/tag-input"
import ImageUpload from "@/components/ui/image-upload"
import MultiImageUpload, {
  type GalleryImage,
} from "@/components/ui/multi-image-upload"
import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import type { Project, ProjectImage } from "@/lib/types"

export interface ProjectFormFiles {
  thumbnailFile: File | null
  thumbnailRemoved: boolean
  newGalleryFiles: File[]
  removedGalleryIds: string[]
  galleryOrder: string[]
}

interface ProjectFormProps {
  defaultValues?: Project
  existingGalleryImages?: ProjectImage[]
  onSubmit: (data: ProjectFormData, files: ProjectFormFiles) => Promise<void>
  submitLabel?: string
}

export default function ProjectForm({
  defaultValues,
  existingGalleryImages = [],
  onSubmit,
  submitLabel = "Create Project",
}: ProjectFormProps) {
  const [loading, setLoading] = useState(false)

  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultValues?.thumbnail_url || null
  )
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false)

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    existingGalleryImages.map((img) => ({
      id: img.id,
      url: img.image_url,
      storagePath: img.storage_path,
    }))
  )
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [removedGalleryIds, setRemovedGalleryIds] = useState<string[]>([])

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          long_description: defaultValues.long_description || "",
          technologies: defaultValues.technologies,
          github_url: defaultValues.github_url || "",
          live_url: defaultValues.live_url || "",
          featured: defaultValues.featured,
          order_index: defaultValues.order_index,
        }
      : {
          title: "",
          description: "",
          long_description: "",
          technologies: [],
          github_url: "",
          live_url: "",
          featured: false,
          order_index: 0,
        },
  })

  const handleThumbnailChange = useCallback((file: File) => {
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setThumbnailRemoved(false)
  }, [])

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setThumbnailRemoved(true)
  }, [])

  const handleGalleryAdd = useCallback(
    (files: File[]) => {
      setNewGalleryFiles((prev) => [...prev, ...files])
      const newImages: GalleryImage[] = files.map((f) => ({
        url: URL.createObjectURL(f),
        file: f,
      }))
      setGalleryImages((prev) => [...prev, ...newImages])
    },
    []
  )

  const handleGalleryRemove = useCallback(
    (index: number) => {
      const image = galleryImages[index]
      if (image.id) {
        setRemovedGalleryIds((prev) => [...prev, image.id!])
      }
      if (image.file) {
        setNewGalleryFiles((prev) => prev.filter((f) => f !== image.file))
      }
      setGalleryImages((prev) => prev.filter((_, i) => i !== index))
    },
    [galleryImages]
  )

  const handleGalleryReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= galleryImages.length) return
      setGalleryImages((prev) => {
        const next = [...prev]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      })
    },
    [galleryImages.length]
  )

  async function handleSubmit(data: ProjectFormData) {
    setLoading(true)
    try {
      await onSubmit(data, {
        thumbnailFile,
        thumbnailRemoved,
        newGalleryFiles,
        removedGalleryIds,
        galleryOrder: galleryImages
          .filter((img) => img.id)
          .map((img) => img.id!),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Project name"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Short Description</Label>
          <Input
            id="description"
            placeholder="One-line description"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="long_description">Long Description</Label>
          <Textarea
            id="long_description"
            placeholder="Detailed project description..."
            rows={4}
            {...form.register("long_description")}
          />
        </div>

        {/* Technologies */}
        <div className="space-y-2 md:col-span-2">
          <Label>Technologies</Label>
          <TagInput
            value={form.watch("technologies")}
            onChange={(tags) => form.setValue("technologies", tags)}
            placeholder="Add technologies..."
          />
          {form.formState.errors.technologies && (
            <p className="text-[10px] text-[#ff3b3b]">
              {form.formState.errors.technologies.message}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="space-y-2 md:col-span-2">
          <Label>Thumbnail</Label>
          <ImageUpload
            value={thumbnailPreview}
            onChange={handleThumbnailChange}
            onRemove={handleThumbnailRemove}
            label="Upload project thumbnail"
          />
        </div>

        {/* Gallery Images */}
        <div className="space-y-2 md:col-span-2">
          <Label>Gallery Images</Label>
          <MultiImageUpload
            images={galleryImages}
            onAdd={handleGalleryAdd}
            onRemove={handleGalleryRemove}
            onReorder={handleGalleryReorder}
          />
        </div>

        {/* Order Index */}
        <div className="space-y-2">
          <Label htmlFor="order_index">Order</Label>
          <Input
            id="order_index"
            type="number"
            {...form.register("order_index", { valueAsNumber: true })}
          />
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            placeholder="https://github.com/..."
            {...form.register("github_url")}
          />
        </div>

        {/* Live URL */}
        <div className="space-y-2">
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            placeholder="https://..."
            {...form.register("live_url")}
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3 md:col-span-2">
          <Switch
            checked={form.watch("featured")}
            onCheckedChange={(checked) => form.setValue("featured", checked)}
          />
          <Label className="cursor-pointer">Featured project</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
