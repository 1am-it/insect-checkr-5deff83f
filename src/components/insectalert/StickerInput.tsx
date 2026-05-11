import * as React from "react";
import { cn } from "@/lib/utils";

export const StickerTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none transition-colors",
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
      "h-12 w-full rounded-full border border-border bg-card px-5 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors",
      className,
    )}
    {...props}
  />
));
StickerInput.displayName = "StickerInput";
