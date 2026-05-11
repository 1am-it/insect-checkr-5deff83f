import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Leaf,
  Check,
  AlertCircle,
  Info,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";

import { StickerCard } from "@/components/insectalert/StickerCard";
import { PillButton } from "@/components/insectalert/PillButton";
import { IconSticker } from "@/components/insectalert/IconSticker";
import { StickerTextarea } from "@/components/insectalert/StickerInput";
import { scanText, type ScanResult } from "@/lib/insectalert-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InsectAlert — Bevat dit product insecten?" },
      {
        name: "description",
        content:
          "Plak een Nederlandse ingrediëntenlijst en check of er insect-ingrediënten in een voedingsproduct zitten. Voor vegetariërs, halal-consumenten en mensen met een schaaldierenallergie.",
      },
      { property: "og:title", content: "InsectAlert — Bevat dit product insecten?" },
      {
        property: "og:description",
        content:
          "Plak ingrediënten, krijg meteen antwoord. Voor vegetariërs, halal en allergieën.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [text, setText] = useState("");

  const mutation = useMutation<ScanResult, Error, string>({
    mutationFn: (t) => scanText(t),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 3) return;
    mutation.mutate(text.trim());
  };

  const reset = () => {
    mutation.reset();
    setText("");
  };

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pb-10 pt-8">
        <Header />

        <div className="flex-1">
          {mutation.isPending ? (
            <LoadingState />
          ) : mutation.isError ? (
            <ErrorState message={mutation.error.message} onRetry={reset} />
          ) : mutation.data ? (
            <ResultState result={mutation.data} onReset={reset} />
          ) : (
            <PasteForm
              text={text}
              setText={setText}
              onSubmit={onSubmit}
              disabled={text.trim().length < 3}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-10 flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <Leaf className="h-4 w-4 text-primary" strokeWidth={2.25} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">
        Insect<span className="text-primary"> alert</span>
      </span>
    </header>
  );
}

function PasteForm({
  text,
  setText,
  onSubmit,
  disabled,
}: {
  text: string;
  setText: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-3">
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-tight text-ink">
          Bevat dit product insecten?
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Plak de ingrediëntenlijst of maak een foto van het etiket. We laten
          het je zien.
        </p>
      </div>

      <StickerCard tone="white" className="p-5">
        <label
          htmlFor="ingredients"
          className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Ingrediëntenlijst
        </label>
        <StickerTextarea
          id="ingredients"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Plak hier de ingrediëntenlijst van het product..."
          className="border-0 bg-transparent p-0 focus:ring-0 focus:border-transparent"
        />
        <div className="mt-4 border-t border-border/60 pt-4">
          <PillButton
            type="submit"
            tone="ink"
            size="lg"
            disabled={disabled}
            className="w-full"
          >
            Controleer ingrediënten
            <ArrowRight className="h-4 w-4" />
          </PillButton>
        </div>
      </StickerCard>

      <p className="text-xs leading-relaxed text-muted-foreground">
        InsectAlert geeft informatie op basis van door jou verstrekte gegevens.
        Controleer bij twijfel altijd het originele etiket of neem contact op
        met de fabrikant.
      </p>
    </form>
  );
}

function LoadingState() {
  return (
    <div className="py-16 text-center">
      <span className="relative inline-flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" strokeWidth={2.25} />
        </span>
      </span>
      <h2 className="mt-6 font-display text-2xl font-semibold text-ink">
        Even checken…
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Dit duurt meestal maar een paar seconden.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StickerCard tone="white" className="px-6 py-10 text-center">
      <IconSticker tone="warn" size={56} className="mx-auto">
        <AlertCircle className="h-6 w-6" style={{ color: "var(--warn-accent)" }} strokeWidth={2} />
      </IconSticker>
      <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
        Hmm, dat ging niet goed
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <PillButton onClick={onRetry} tone="ink" size="md" className="mt-6">
        <RotateCcw className="h-4 w-4" /> Probeer opnieuw
      </PillButton>
    </StickerCard>
  );
}

function ResultState({
  result,
  onReset,
}: {
  result: ScanResult;
  onReset: () => void;
}) {
  const s = result.state;
  const isAlert = s === "gevonden";
  const isSafe = s === "niet-gevonden";
  const isDoubt = s === "twijfel";

  const headline = isAlert
    ? "Ja, dit product bevat insecten"
    : isSafe
    ? "Geen insecten gevonden"
    : "We weten het niet zeker";

  const label = isAlert ? "Gevonden" : isSafe ? "Niet gevonden" : "Twijfel";
  const tone: "alert" | "safe" | "warn" = isAlert ? "alert" : isSafe ? "safe" : "warn";
  const Icon = isAlert ? AlertCircle : isSafe ? Check : Info;
  const accentVar =
    tone === "alert" ? "var(--alert-accent)" : tone === "safe" ? "var(--safe-accent)" : "var(--warn-accent)";

  const firstMatch = result.matches[0];

  return (
    <div className="space-y-5">
      {/* Result hero card */}
      <StickerCard tone={tone} size="lg" className="overflow-hidden p-0">
        <div className="px-6 pt-6 pb-7">
          <div className="flex items-center gap-2">
            <IconSticker tone="cream" size={36}>
              <Icon className="h-4 w-4" style={{ color: accentVar }} strokeWidth={2.25} />
            </IconSticker>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: accentVar }}
            >
              {label}
            </span>
          </div>
          <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.15] tracking-tight">
            {headline}
          </h2>

          {isAlert && firstMatch && (
            <div className="mt-5">
              <div className="text-lg font-semibold leading-tight">{firstMatch.nlName}</div>
              {firstMatch.latinName && (
                <div className="text-sm italic opacity-80">{firstMatch.latinName}</div>
              )}
            </div>
          )}

          {isSafe && (
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">
              We hebben geen insectenbestanddelen of E-nummers herkend in deze
              ingrediëntenlijst.
            </p>
          )}

          {isDoubt && firstMatch?.decoderText && (
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">
              {firstMatch.decoderText}
            </p>
          )}
        </div>
      </StickerCard>

      {/* Snippet from label */}
      {firstMatch?.snippet && (
        <div>
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Uit de ingrediëntenlijst
          </div>
          <StickerCard tone="cream" size="sm" className="p-4">
            <p className="text-sm leading-relaxed text-ink/80">
              “{firstMatch.snippet}”
            </p>
          </StickerCard>
        </div>
      )}

      {/* Decoder for "gevonden" */}
      {isAlert && firstMatch?.decoderText && (
        <div>
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Wat is dit?
          </div>
          <StickerCard tone="white" size="sm" className="p-5">
            <p className="text-sm leading-relaxed text-ink/85">
              {firstMatch.decoderText}
            </p>
          </StickerCard>
        </div>
      )}

      {isSafe && (
        <p className="px-1 text-sm leading-relaxed text-muted-foreground">
          Twijfel je? Controleer ook de allergeneninformatie op de verpakking.
        </p>
      )}

      {isDoubt && (
        <StickerCard tone="white" size="sm" className="p-4">
          <p className="text-sm leading-relaxed text-ink/80">
            <span className="font-semibold text-ink">Tip — </span>
            kijk of er een E-nummer naast staat, of vraag het bij de fabrikant.
          </p>
        </StickerCard>
      )}

      <FeedbackRow />

      <PillButton onClick={onReset} tone="ink" size="lg" className="w-full">
        <RotateCcw className="h-4 w-4" /> Nieuwe controle
      </PillButton>
    </div>
  );
}

function FeedbackRow() {
  const [sent, setSent] = useState<"up" | "down" | null>(null);

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Bedankt voor je feedback.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-1">
      <span className="text-sm text-muted-foreground">Klopt dit?</span>
      <PillButton
        type="button"
        tone="cream"
        size="sm"
        onClick={() => setSent("up")}
        aria-label="Klopt"
      >
        <ThumbsUp className="h-3.5 w-3.5" /> Klopt
      </PillButton>
      <PillButton
        type="button"
        tone="cream"
        size="sm"
        onClick={() => setSent("down")}
        aria-label="Klopt niet"
      >
        <ThumbsDown className="h-3.5 w-3.5" /> Klopt niet
      </PillButton>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-14 space-y-2 border-t border-border/60 pt-6 text-[11px] leading-relaxed text-muted-foreground">
      <p>
        InsectAlert is een hulpmiddel voor het herkennen van insect-ingrediënten
        in voedingsmiddelen. Geen medisch advies. Bron: EU Verordening 2017/2470
        (Novel Food).
      </p>
      <p>
        Foto's worden niet door ons opgeslagen. Voor de analyse gebruiken we
        Google Gemini.
      </p>
    </footer>
  );
}
