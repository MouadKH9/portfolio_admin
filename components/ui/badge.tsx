import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-[#00ff41]/30 bg-[#00ff41]/5 text-[#00ff41]",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-[#ff3b3b]/30 bg-[#ff3b3b]/5 text-[#ff3b3b]",
        outline: "border-border text-muted-foreground",
        cyan: "border-[#00d4ff]/30 bg-[#00d4ff]/5 text-[#00d4ff]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
