import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  long_description: z.string().optional().default(""),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  github_url: z.string().optional().default(""),
  live_url: z.string().optional().default(""),
  featured: z.boolean().default(false),
  order_index: z.number().int().default(0),
})

export const skillSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Skill name is required"),
  order_index: z.number().int().default(0),
})

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional().default(""),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().default(""),
  current: z.boolean().default(false),
  order_index: z.number().int().default(0),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type ExperienceFormData = z.infer<typeof experienceSchema>
