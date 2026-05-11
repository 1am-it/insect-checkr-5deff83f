import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "sun" | "mint" | "sky" | "coral" | "alert";

const tones: Record<Tone, string> = {
  sun: "bg-sun",
  mint: "bg-mint",
  sky: "bg-sky",
  coral: "bg-coral",
  alert: "bg-alert",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  size?: number;
}

/** Decorative organic blob, absolutely positioned by parent. */
export function Blob({ tone = "sun", size = 240, className, style, ...props }: Props) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute opacity-80 blur-[1px]", tones[tone], className)}
      style={{
        width: size,
        height: size,
        borderRadius: "62% 38% 56% 44% / 49% 56% 44% 51%",
        ...style,
      }}
      {...props}
    />
  );
}
