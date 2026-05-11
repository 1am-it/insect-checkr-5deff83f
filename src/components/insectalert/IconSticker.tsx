import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "sun" | "mint" | "sky" | "coral" | "alert" | "safe" | "warn" | "cream";

const tones: Record<Tone, string> = {
  sun: "bg-sun",
  mint: "bg-mint",
  sky: "bg-sky",
  coral: "bg-coral",
  alert: "bg-alert text-alert-foreground",
  safe: "bg-safe text-safe-foreground",
  warn: "bg-warn text-warn-foreground",
  cream: "bg-cream",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  rotate?: number;
  size?: number;
}

export function IconSticker({
  tone = "sun",
  rotate = -6,
  size = 56,
  className,
  style,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border-2 border-ink text-ink shadow-[3px_3px_0_0_var(--ink)]",
        tones[tone],
        className,
      )}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
