import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

// HUD chip style: recessed panel, mono font, thin border
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-panel-alt)] text-[var(--color-muted)] border border-[var(--color-border)]",
        success:
          "bg-[var(--color-panel-alt)] text-[#4ade80] border border-[rgba(74,222,128,0.3)]",
        warning:
          "bg-[var(--color-panel-alt)] text-[var(--color-amber)] border border-[rgba(245,179,1,0.3)]",
        mock:
          "bg-[var(--color-panel-alt)] text-[var(--color-amber)] border border-[rgba(245,179,1,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
