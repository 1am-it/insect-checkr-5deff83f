import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "cream" | "white" | "alert" | "safe" | "warn" | "sun" | "mint" | "sky" | "coral";

const toneClass: Record<Tone, string> = {
  cream: "bg-cream text-ink",
  white: "bg-card text-ink",
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
  size?: "sm" | "md" | "lg";
}

export const StickerCard = React.forwardRef<HTMLDivElement, Props>(
  ({ className, tone = "white", rotate = 0, size = "md", style, ...props }, ref) => {
    const shadow =
      size === "sm" ? "shadow-[2px_2px_0_0_var(--ink)]" :
      size === "lg" ? "shadow-[6px_6px_0_0_var(--ink)]" :
      "shadow-[4px_4px_0_0_var(--ink)]";
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border-2 border-ink",
          toneClass[tone],
          shadow,
          className,
        )}
        style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
        {...props}
      />
    );
  },
);
StickerCard.displayName = "StickerCard";
