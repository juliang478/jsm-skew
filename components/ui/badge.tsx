import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "positive"
  | "negative"
  | "left"
  | "center"
  | "right"
  | "mixed";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "bg-bg-secondary text-text-primary",
  positive: "bg-sentiment-positive-surface text-sentiment-positive",
  negative: "bg-bias-left/10 text-bias-left",
  left: "bg-bias-left text-bg-primary",
  center: "bg-bg-secondary text-text-primary",
  right: "bg-bias-right text-bg-primary",
  mixed: "bg-bg-secondary text-accent",
};

export function Badge({
  children,
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm px-2 text-caption font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}