import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "ink" | "alert" | "safe" | "warn" | "muted";

const tones: Record<Tone, string> = {
  ink: "bg-primary/10 text-primary",
  alert: "bg-alert text-alert-foreground",
  safe: "bg-safe text-safe-foreground",
  warn: "bg-warn text-warn-foreground",
  muted: "bg-muted text-muted-foreground",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** kept for API back-compat; ignored. */
  rotate?: number;
}

export function StickerBadge({ tone = "ink", className, rotate: _rotate, ...props }: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
