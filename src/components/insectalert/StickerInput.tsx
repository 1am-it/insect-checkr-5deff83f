import * as React from "react";
import { cn } from "@/lib/utils";

export const StickerTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-2xl border-2 border-ink bg-card px-4 py-3 text-base text-ink placeholder:text-muted-foreground shadow-[3px_3px_0_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-cream resize-none",
      className,
    )}
    {...props}
  />
));
StickerTextarea.displayName = "StickerTextarea";

export const StickerInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-full border-2 border-ink bg-card px-5 text-base text-ink placeholder:text-muted-foreground shadow-[3px_3px_0_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-cream",
      className,
    )}
    {...props}
  />
));
StickerInput.displayName = "StickerInput";
