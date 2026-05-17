import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Leaf } from "lucide-react";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/preview/producten")({
  head: () => ({
    meta: [
      { title: "Welke producten bevatten insecten? — InsectAlert" },
      {
        name: "description",
        content:
          "Overzicht van insecten die in EU-voedingsproducten zijn toegestaan en in welke productcategorieën ze voorkomen.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProductenPreview,
});

type InsectTone = "coral" | "mint" | "lavender" | "sun" | "rose";

interface InsectRow {
  emoji: string;
  name: string;
  tone: InsectTone;
  categories: string[];
  isNew?: boolean;
  note?: string;
}

const insects: InsectRow[] = [
  {
    emoji: "🦗",
    name: "Huiskrekel",
    tone: "coral",
    categories: [
      "Meergranenbrood",
      "Koekjes",
      "Pasta",
      "Granenrepen",
      "Eiwitproducten",
    ],
  },
  {
    emoji: "🪱",
    name: "Gele meelworm",
    tone: "mint",
    categories: ["Pasta", "Koekjes", "Brood", "Vleesvervangers"],
  },
  {
    emoji: "🪱",
    name: "Kleine meelworm",
    tone: "lavender",
    isNew: true,
    categories: ["Brood", "Pasta", "Koekjes"],
  },
  {
    emoji: "🦗",
    name: "Treksprinkhaan",
    tone: "sun",
    categories: ["Meergranenbrood", "Peulvruchtenproducten"],
  },
  {
    emoji: "🪲",
    name: "Schildluis (E120)",
    tone: "rose",
    categories: [
      "Roze koeken",
      "Rood snoep",
      "Rode zuiveldranken",
      "Banket",
    ],
  },
];

const toneClass: Record<InsectTone, string> = {
  coral: "bg-coral",
  mint: "bg-mint",
  lavender: "bg-[oklch(0.92_0.04_300)]",
  sun: "bg-sun",
  rose: "bg-[oklch(0.9_0.07_20)]",
};

function ProductenPreview() {
  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pb-10 pt-8">
        <header className="mb-8 flex items-center gap-3 select-none">
          <span className="inline-flex h-12 w-12 -rotate-[4deg] items-center justify-center rounded-full border-4 border-card bg-primary/15">
            <Leaf className="h-6 w-6 text-ink" strokeWidth={2} />
          </span>
          <h1 className="font-display text-3xl font-semibold leading-none tracking-tight text-ink">
            Insect<span className="ml-0.5 text-primary">Alert</span>
          </h1>
        </header>

        <StickerCard tone="white" className="p-5">
          <h2 className="mb-5 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">
            Welke producten bevatten insecten?
          </h2>

          <ul className="space-y-2.5">
            {insects.map((insect, idx) => (
              <InsectAccordion
                key={insect.name}
                insect={insect}
                defaultOpen={idx === 0}
              />
            ))}
          </ul>
        </StickerCard>

        <p className="mt-5 px-1 text-xs leading-relaxed text-muted-foreground">
          Deze lijst is niet uitputtend. Het etiket blijft altijd leidend.
        </p>
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
          Bron: EU Novel Food Verordening 2015/2283
        </p>
      </main>
    </div>
  );
}

function InsectAccordion({
  insect,
  defaultOpen,
}: {
  insect: InsectRow;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const contentId = `insect-${insect.name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <li>
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-cream/50"
        >
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg",
              toneClass[insect.tone],
            )}
            aria-hidden
          >
            {insect.emoji}
          </span>
          <span className="flex-1 font-display text-lg font-semibold text-ink">
            {insect.name}
          </span>
          {insect.isNew && (
            <span className="rounded-full bg-[oklch(0.92_0.04_300)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.35_0.08_300)]">
              Nieuw
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            id={contentId}
            className="border-t border-border/40 bg-cream/40 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {insect.categories.map((cat, i) => (
                <span key={cat} className="inline-flex items-center gap-2">
                  <span className="text-sm text-ink/85">{cat}</span>
                  {i < insect.categories.length - 1 && (
                    <span className="h-1 w-1 rounded-full bg-alert-accent/60" />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
