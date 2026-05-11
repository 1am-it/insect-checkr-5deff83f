import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pill = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink font-semibold transition-transform active:translate-y-0.5 active:translate-x-0.5 active:shadow-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
  {
    variants: {
      tone: {
        ink: "bg-ink text-cream",
        cream: "bg-cream text-ink",
        alert: "bg-alert text-alert-foreground",
        safe: "bg-safe text-safe-foreground",
        sun: "bg-sun text-ink",
        sky: "bg-sky text-ink",
      },
      size: {
        sm: "h-9 px-4 text-sm shadow-[2px_2px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]",
        md: "h-12 px-6 text-base shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--ink)]",
        lg: "h-14 px-8 text-lg shadow-[5px_5px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--ink)]",
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
