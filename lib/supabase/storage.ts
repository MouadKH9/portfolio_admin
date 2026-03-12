import { createClient } from "./client"

const BUCKET = "project-images"

function getFileExtension(file: File): string {
  const parts = file.name.split(".")
  return parts.length > 1 ? parts.pop()! : "jpg"
}

export async function uploadProjectThumbnail(
  projectId: string,
  file: File
): Promise<string> {
  const supabase = createClient()
  const ext = getFileExtension(file)
  const path = `${projectId}/thumbnail.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })

  if (error) throw new Error(`Failed to upload thumbnail: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return publicUrl
}

export async function uploadProjectGalleryImage(
  projectId: string,
  file: File
): Promise<{ url: string; storagePath: string }> {
  const supabase = createClient()
  const ext = getFileExtension(file)
  const uuid = crypto.randomUUID()
  const storagePath = `${projectId}/gallery/${uuid}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file)

  if (error) throw new Error(`Failed to upload image: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

  return { url: publicUrl, storagePath }
}

export async function deleteStorageFile(storagePath: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath])
  if (error) throw new Error(`Failed to delete file: ${error.message}`)
}

export async function deleteProjectFolder(projectId: string): Promise<void> {
  const supabase = createClient()

  // List and delete all files in the project folder
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list(projectId, { limit: 1000 })

  if (listError) return

  if (files && files.length > 0) {
    const paths = files.map((f) => `${projectId}/${f.name}`)
    await supabase.storage.from(BUCKET).remove(paths)
  }

  // Also clean gallery subfolder
  const { data: galleryFiles } = await supabase.storage
    .from(BUCKET)
    .list(`${projectId}/gallery`, { limit: 1000 })

  if (galleryFiles && galleryFiles.length > 0) {
    const galleryPaths = galleryFiles.map(
      (f) => `${projectId}/gallery/${f.name}`
    )
    await supabase.storage.from(BUCKET).remove(galleryPaths)
  }
}
