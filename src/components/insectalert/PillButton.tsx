import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pill = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
  {
    variants: {
      tone: {
        ink: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.08)]",
        cream: "bg-card text-ink border border-border hover:bg-cream",
        alert: "bg-alert-accent text-primary-foreground hover:opacity-90",
        safe: "bg-safe-accent text-primary-foreground hover:opacity-90",
        sun: "bg-sun text-ink hover:opacity-90",
        sky: "bg-sky text-ink hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: { tone: "ink", size: "md" },
  },
);

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pill> {}

export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, tone, size, ...props }, ref) => (
    <button ref={ref} className={cn(pill({ tone, size }), className)} {...props} />
  ),
);
PillButton.displayName = "PillButton";
