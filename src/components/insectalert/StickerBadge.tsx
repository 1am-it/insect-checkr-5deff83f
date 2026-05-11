import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "ink" | "alert" | "safe" | "warn" | "sun" | "mint" | "sky" | "coral";

const tones: Record<Tone, string> = {
  ink: "bg-ink text-cream",
  alert: "bg-alert text-alert-foreground",
  safe: "bg-safe text-safe-foreground",
  warn: "bg-warn text-warn-foreground",
  sun: "bg-sun text-ink",
  mint: "bg-mint text-ink",
  sky: "bg-sky text-ink",
  coral: "bg-coral text-ink",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  rotate?: number;
}

export function StickerBadge({ tone = "ink", rotate = -3, className, style, ...props }: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0_0_var(--ink)]",
        tones[tone],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
      {...props}
    />
  );
}
