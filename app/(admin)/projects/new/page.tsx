"use client"

import { useRouter } from "next/navigation"
import ProjectForm from "@/components/forms/project-form"
import type { ProjectFormFiles } from "@/components/forms/project-form"
import {
  createProject,
  updateProjectThumbnail,
  addProjectGalleryImages,
} from "@/lib/actions/projects"
import {
  uploadProjectThumbnail,
  uploadProjectGalleryImage,
} from "@/lib/supabase/storage"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ProjectFormData } from "@/lib/validations"

export default function NewProjectPage() {
  const router = useRouter()

  async function handleSubmit(data: ProjectFormData, files: ProjectFormFiles) {
    try {
      const projectId = await createProject(data)

      // Upload thumbnail
      if (files.thumbnailFile) {
        const url = await uploadProjectThumbnail(projectId, files.thumbnailFile)
        await updateProjectThumbnail(projectId, url)
      }

      // Upload gallery images
      if (files.newGalleryFiles.length > 0) {
        const galleryResults = await Promise.all(
          files.newGalleryFiles.map((file) =>
            uploadProjectGalleryImage(projectId, file)
          )
        )
        await addProjectGalleryImages(
          projectId,
          galleryResults.map((r, i) => ({
            image_url: r.url,
            storage_path: r.storagePath,
            order_index: i,
          }))
        )
      }

      toast.success("Project created")
      router.push("/projects")
    } catch {
      toast.error("Failed to create project")
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
              ~/projects/new
            </span>
          </div>
        </div>
        <div className="p-6">
          <ProjectForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
