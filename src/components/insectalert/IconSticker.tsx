import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "sun" | "mint" | "sky" | "coral" | "alert" | "safe" | "warn" | "cream" | "ink";

const tones: Record<Tone, string> = {
  sun: "bg-sun text-ink",
  mint: "bg-mint text-ink",
  sky: "bg-sky text-ink",
  coral: "bg-coral text-ink",
  alert: "bg-alert text-alert-foreground",
  safe: "bg-safe text-safe-foreground",
  warn: "bg-warn text-warn-foreground",
  cream: "bg-cream text-ink",
  ink: "bg-primary/10 text-primary",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** kept for API back-compat; ignored. */
  rotate?: number;
  size?: number;
}

export function IconSticker({
  tone = "cream",
  size = 48,
  className,
  style,
  rotate: _rotate,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl",
        tones[tone],
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
