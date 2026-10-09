"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-700 text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
        ghost:
          "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 dark:hover:bg-zinc-800",
        accent:
          "bg-amber-700 text-amber-50 hover:bg-amber-600 dark:bg-amber-700 dark:text-amber-50 dark:hover:bg-amber-600",
        danger:
          "bg-red-800 text-red-50 hover:bg-red-700 dark:bg-red-800 dark:text-red-50 dark:hover:bg-red-700",
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
