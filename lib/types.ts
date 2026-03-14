export interface Project {
  id: string
  title: string
  description: string
  long_description: string | null
  thumbnail_url: string | null
  technologies: string[]
  github_url: string | null
  live_url: string | null
  featured: boolean
  order_index: number
  created_at: string
  project_images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  storage_path: string
  order_index: number
  created_at: string
}

export interface Skill {
  id: string
  category: string
  name: string
  order_index: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string | null
  start_date: string
  end_date: string | null
  current: boolean
  order_index: number
  created_at: string
}

export interface ContactMessage {
  id: string
  email: string
  message: string
  created_at: string
}
