"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default: gunmetal panel button with amber focus ring
        default:
          "bg-[var(--color-panel-alt)] text-[var(--color-steel)] hover:bg-[var(--color-border)] focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-panel)]",
        // Ghost: transparent, subtle hover
        ghost:
          "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-panel-alt)] hover:text-[var(--color-steel)] focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-panel)]",
        // Accent: amber send button (dark text on amber bg)
        accent:
          "bg-[var(--color-amber)] text-[var(--color-amber-fg)] hover:bg-[var(--color-amber-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cave)]",
        // Danger: red-outline stop button — clearly distinguishable
        danger:
          "bg-transparent text-[#f87171] border border-[#c0392b] hover:bg-[rgba(192,57,43,0.15)] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-panel)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
