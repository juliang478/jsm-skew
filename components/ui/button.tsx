import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-text-primary text-white hover:bg-primary-hover disabled:bg-bg-secondary disabled:text-text-secondary",
  secondary:
    "bg-bg-secondary text-text-primary hover:bg-border disabled:text-text-secondary",
  outline:
    "border border-border bg-bg-primary text-text-primary hover:bg-surface disabled:text-text-secondary",
  text: "bg-transparent text-text-primary hover:text-accent disabled:text-text-secondary",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-sm px-4 text-body-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      data-variant={variant}
      type={type}
      {...props}
    />
  );
}