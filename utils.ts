import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
