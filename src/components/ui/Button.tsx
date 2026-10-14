import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-yumm-pink text-white hover:bg-yumm-coral focus-visible:ring-yumm-pink",
  secondary:
    "bg-yumm-lilac text-white hover:bg-yumm-pink focus-visible:ring-yumm-lilac",
  ghost:
    "bg-transparent text-ink hover:bg-surface-muted focus-visible:ring-ink-muted",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-yumm px-5 py-2.5",
        "font-display font-semibold text-sm",
        "transition-colors duration-200",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
    />
  );
}