# Portfolio Admin Dashboard

Protected admin dashboard for managing portfolio content.

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # ESLint
```

## Architecture

### Routing (App Router)

```
app/
├── login/page.tsx              # Public login page
├── auth/callback/route.ts      # OAuth callback
└── (admin)/                    # Auth-protected route group
    ├── layout.tsx              # Sidebar + Header, auth check
    ├── dashboard/
    ├── projects/               # CRUD + reorder
    ├── skills/                 # CRUD
    ├── experience/             # CRUD
    └── messages/               # Read + delete
```

### Pattern: Server/Client Split

Each entity follows the same pattern:
- **List page** (`page.tsx`): Server component, fetches data, renders table
- **Actions** (`actions.tsx`): Client component with delete/reorder UI
- **New page** (`new/page.tsx`): Client component with form
- **Edit page** (`[id]/edit/page.tsx`): Server component fetches data
- **Edit client** (`[id]/edit/client.tsx`): Client component with form + default values

### Pattern: Form → Server Action → Revalidate

1. Client form component validates with react-hook-form + Zod
2. Parent page calls server action with validated data
3. Server action parses again with Zod, executes Supabase query
4. `revalidatePath()` called to refresh cached data

### Pattern: Image Uploads (Projects)

Images are **not** part of the Zod schema. They're managed via component state:
1. `ProjectForm` collects files in state, passes `ProjectFormFiles` alongside `ProjectFormData`
2. Parent page creates/updates project first (gets ID back)
3. Uploads files to Supabase Storage via `lib/supabase/storage.ts` (client-side)
4. Saves URLs to DB via server actions (`updateProjectThumbnail`, `addProjectGalleryImages`)

Storage paths: `{projectId}/thumbnail.{ext}`, `{projectId}/gallery/{uuid}.{ext}`

## Key Files

| File | Purpose |
|------|---------|
| `lib/types.ts` | TypeScript interfaces (Project, ProjectImage, Skill, Experience, ContactMessage) |
| `lib/validations.ts` | Zod schemas (projectSchema, skillSchema, experienceSchema) |
| `lib/actions/*.ts` | Server actions for each entity |
| `lib/supabase/server.ts` | Server-side Supabase client (cookie-based) |
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/storage.ts` | File upload/delete helpers |
| `lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `middleware.ts` | Auth redirect (unauthenticated → /login) |

## UI

- **Component library**: Radix UI primitives in `components/ui/`, styled with Tailwind + CVA
- **Icons**: lucide-react
- **Toasts**: sonner
- **Design**: Dark mode only, terminal aesthetic (#00ff41 neon green, #ff3b3b red, #00d4ff cyan)
