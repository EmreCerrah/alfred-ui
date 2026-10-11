"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export type TextareaProps = React.ComponentProps<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, onFocus, onBlur, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Console / recessed input — dark background, amber focus ring
          "flex w-full rounded-md px-3 py-2 text-sm resize-none",
          "placeholder:text-[var(--color-dim)]",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          background: "var(--color-cave)",
          border: "1px solid var(--color-border)",
          color: "var(--color-steel)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px var(--color-amber), 0 0 8px 0 var(--color-amber-glow)";
          e.currentTarget.style.borderColor = "var(--color-amber-dim)";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.borderColor = "var(--color-border)";
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
