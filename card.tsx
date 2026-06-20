import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-card px-5 py-3 font-display font-semibold text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-primary text-white hover:bg-primary-hover",
          variant === "secondary" &&
            "bg-surface text-ink border border-border hover:bg-paper",
          variant === "ghost" && "text-ink-muted hover:text-ink",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
