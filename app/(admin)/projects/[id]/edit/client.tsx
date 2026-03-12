"use client"

import { useRouter } from "next/navigation"
import ProjectForm from "@/components/forms/project-form"
import type { ProjectFormFiles } from "@/components/forms/project-form"
import {
  updateProject,
  updateProjectThumbnail,
  addProjectGalleryImages,
  removeProjectGalleryImages,
  updateGalleryOrder,
} from "@/lib/actions/projects"
import {
  uploadProjectThumbnail,
  uploadProjectGalleryImage,
  deleteStorageFile,
} from "@/lib/supabase/storage"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Project, ProjectImage } from "@/lib/types"
import type { ProjectFormData } from "@/lib/validations"

export default function EditProjectClient({
  project,
  galleryImages,
}: {
  project: Project
  galleryImages: ProjectImage[]
}) {
  const router = useRouter()

  async function handleSubmit(data: ProjectFormData, files: ProjectFormFiles) {
    try {
      await updateProject(project.id, data)

      // Handle thumbnail
      if (files.thumbnailRemoved && !files.thumbnailFile) {
        await updateProjectThumbnail(project.id, null)
      }
      if (files.thumbnailFile) {
        const url = await uploadProjectThumbnail(
          project.id,
          files.thumbnailFile
        )
        await updateProjectThumbnail(project.id, url)
      }

      // Remove deleted gallery images
      if (files.removedGalleryIds.length > 0) {
        const removedImages = galleryImages.filter((img) =>
          files.removedGalleryIds.includes(img.id)
        )
        // Delete from storage
        await Promise.all(
          removedImages.map((img) => deleteStorageFile(img.storage_path))
        )
        // Delete from DB
        await removeProjectGalleryImages(files.removedGalleryIds)
      }

      // Upload new gallery images
      if (files.newGalleryFiles.length > 0) {
        const startIndex = galleryImages.length - files.removedGalleryIds.length
        const galleryResults = await Promise.all(
          files.newGalleryFiles.map((file) =>
            uploadProjectGalleryImage(project.id, file)
          )
        )
        await addProjectGalleryImages(
          project.id,
          galleryResults.map((r, i) => ({
            image_url: r.url,
            storage_path: r.storagePath,
            order_index: startIndex + i,
          }))
        )
      }

      // Update gallery order for existing images
      if (files.galleryOrder.length > 0) {
        await updateGalleryOrder(
          files.galleryOrder.map((id, index) => ({ id, order_index: index }))
        )
      }

      toast.success("Project updated")
      router.push("/projects")
    } catch {
      toast.error("Failed to update project")
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground tracking-wider uppercase transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to projects
      </Link>

      <div className="border border-border bg-card/30">
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="text-[9px] text-muted-foreground ml-2 tracking-wider">
              ~/projects/{project.title.toLowerCase().replace(/\s+/g, "-")}/edit
            </span>
          </div>
        </div>
        <div className="p-6">
          <ProjectForm
            defaultValues={project}
            existingGalleryImages={galleryImages}
            onSubmit={handleSubmit}
            submitLabel="Update Project"
          />
        </div>
      </div>
    </div>
  )
}
