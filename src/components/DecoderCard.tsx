import * as React from "react";
import { resolvePattern, type Pattern } from "@/data/patterns";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { cn } from "@/lib/utils";

export type DecoderCardProps = {
  dataQuery: {
    lookup: "id" | "eNumber" | "latinName" | "synonym" | "comparison";
    value?: string;
    ids?: string[];
  };
};

const SOURCE_CITATION =
  "Bron: NVWA, Foodwatch NL, EU Implementing Regulation 2017/2470";

function CategoryPill({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "alert" | "warn" | "muted";
}) {
  const toneClass =
    tone === "alert"
      ? "bg-alert-accent text-primary-foreground"
      : tone === "warn"
      ? "bg-warn-accent text-primary-foreground"
      : tone === "muted"
      ? "bg-muted text-muted-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function getCategoryLabel(p: Pattern): { label: string; tone: "ink" | "alert" | "warn" } {
  if (p.certainty === "twijfel") return { label: "Twijfelgeval", tone: "warn" };
  if (p.type === "insect") return { label: "Insect", tone: "ink" };
  if (p.type === "colorant") return { label: "Additief", tone: "alert" };
  return { label: "Ingrediënt", tone: "ink" };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StickerCard tone="white" size="lg" className="relative overflow-hidden p-6 sm:p-8">
      <Blob
        tone="sun"
        size={140}
        className="-right-10 -top-10 opacity-50"
      />
      <Blob
        tone="mint"
        size={100}
        className="-bottom-8 -left-8 opacity-40"
      />
      <div className="relative z-10 flex flex-col gap-4">{children}</div>
    </StickerCard>
  );
}

function Footer() {
  return (
    <p className="relative z-10 mt-2 text-[11px] leading-relaxed text-muted-foreground">
      {SOURCE_CITATION}
    </p>
  );
}

export function DecoderCard({ dataQuery }: DecoderCardProps) {
  if (dataQuery.lookup === "comparison") {
    return (
      <Shell>
        <CategoryPill tone="muted">Vergelijking</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Vergelijking komt eraan
        </h2>
        <p className="text-sm leading-relaxed text-ink/80">
          Deze weergave is nog niet beschikbaar.
        </p>
        <Footer />
      </Shell>
    );
  }

  const pattern = dataQuery.value ? resolvePattern(dataQuery.value) : null;

  if (!pattern) {
    return (
      <Shell>
        <CategoryPill tone="muted">Geen match</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Dit ingrediënt staat (nog) niet in onze database
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          We hebben momenteel info over EU-goedgekeurde insecten en karmijn (E120).
          Bedoelde je iets anders, stel dan een nieuwe vraag.
        </p>
        <Footer />
      </Shell>
    );
  }

  const { label, tone } = getCategoryLabel(pattern);
  const heading = pattern.nlName ?? "Onbekend ingrediënt";

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill tone={tone}>{label}</CategoryPill>
        {pattern.pending && (
          <CategoryPill tone="warn">Nog niet toegelaten</CategoryPill>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {heading}
        </h2>
        {pattern.latinName && (
          <p className="text-sm italic text-muted-foreground sm:text-base">
            {pattern.latinName}
          </p>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink/85 sm:text-base">
        {pattern.decoderText}
      </p>

      <Footer />
    </Shell>
  );
}

export default DecoderCard;
