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
  /** kept for API back-compat; ignored. */
  rotate?: number;
  size?: "sm" | "md" | "lg";
}

export const StickerCard = React.forwardRef<HTMLDivElement, Props>(
  ({ className, tone = "white", size = "md", style, rotate: _rotate, ...props }, ref) => {
    const shadow =
      size === "sm"
        ? "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]"
        : size === "lg"
        ? "shadow-[0_2px_4px_rgba(0,0,0,0.05),0_16px_40px_rgba(0,0,0,0.07)]"
        : "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]";
    return (
      <div
        ref={ref}
        className={cn("rounded-3xl border border-border/60", toneClass[tone], shadow, className)}
        style={style}
        {...props}
      />
    );
  },
);
StickerCard.displayName = "StickerCard";
