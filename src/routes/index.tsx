import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Bug,
  Check,
  AlertTriangle,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { StickerCard } from "@/components/insectalert/StickerCard";
import { PillButton } from "@/components/insectalert/PillButton";
import { StickerBadge } from "@/components/insectalert/StickerBadge";
import { IconSticker } from "@/components/insectalert/IconSticker";
import { Blob } from "@/components/insectalert/Blob";
import { StickerTextarea } from "@/components/insectalert/StickerInput";
import { scanText, type ScanResult } from "@/lib/insectalert-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InsectAlert — Bevat dit product insecten?" },
      {
        name: "description",
        content:
          "Plak een Nederlandse ingrediëntenlijst en check direct of er insect-ingrediënten in een voedingsproduct zitten. Voor vegetariërs, halal-consumenten en mensen met een schaaldierenallergie.",
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
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      {/* decorative blobs — warm sfeer */}
      <Blob tone="sun" size={260} className="-top-20 -left-16" />
      <Blob tone="mint" size={200} className="top-48 -right-20" />
      <Blob tone="coral" size={160} className="bottom-32 -left-10" />
      <Blob tone="sky" size={180} className="bottom-0 -right-16" />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-10">
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
    <div className="mb-8 flex items-center gap-3">
      <IconSticker tone="alert" size={44} rotate={-6}>
        <Bug className="h-5 w-5 text-alert-foreground" strokeWidth={2.5} />
      </IconSticker>
      <span className="font-display text-2xl font-bold text-ink">
        Insect alert
      </span>
    </div>
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
    <form onSubmit={onSubmit} className="space-y-6">
      <StickerCard tone="white" rotate={-0.5} className="px-6 py-7">
        <h1 className="font-display text-4xl font-bold leading-[1.05] text-ink">
          Bevat dit product <span className="italic">insecten</span>?
        </h1>
        <p className="mt-3 text-base text-ink/70">
          Plak de ingrediëntenlijst of maak een foto van het etiket.
        </p>
      </StickerCard>

      <StickerCard tone="cream" className="p-4">
        <label htmlFor="ingredients" className="mb-2 block text-sm font-semibold text-ink">
          Ingrediënten
        </label>
        <StickerTextarea
          id="ingredients"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Plak hier de ingrediëntenlijst van het product..."
        />
        <div className="mt-4 flex justify-end">
          <PillButton type="submit" tone="ink" size="lg" disabled={disabled}>
            Controleer ingrediënten
            <ArrowRight className="h-5 w-5" />
          </PillButton>
        </div>
      </StickerCard>

      <p className="text-center text-xs leading-relaxed text-ink/55">
        InsectAlert geeft informatie op basis van door jou verstrekte gegevens.
        Controleer bij twijfel altijd het originele etiket of neem contact op
        met de fabrikant.
      </p>
    </form>
  );
}

function LoadingState() {
  return (
    <StickerCard tone="white" rotate={-0.5} className="px-6 py-12 text-center">
      <IconSticker tone="sun" size={72} rotate={-6} className="mx-auto animate-pulse">
        <Bug className="h-8 w-8 text-ink" strokeWidth={2.5} />
      </IconSticker>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">
        Even checken…
      </h2>
      <p className="mt-2 text-sm text-ink/70">
        Dit duurt meestal maar een paar seconden.
      </p>
    </StickerCard>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StickerCard tone="white" rotate={-0.5} className="px-6 py-10 text-center">
      <IconSticker tone="warn" size={72} rotate={-6} className="mx-auto">
        <AlertTriangle className="h-8 w-8 text-ink" strokeWidth={2.5} />
      </IconSticker>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">
        Hmm, dat ging niet goed
      </h2>
      <p className="mt-2 text-sm text-ink/70">{message}</p>
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

  const badge = isAlert ? "Gevonden" : isSafe ? "Niet gevonden" : "Twijfel";
  const badgeTone: "alert" | "safe" | "warn" = isAlert ? "alert" : isSafe ? "safe" : "warn";
  const cardTone: "alert" | "safe" | "warn" = isAlert ? "alert" : isSafe ? "safe" : "warn";
  const Icon = isAlert ? Bug : isSafe ? Check : AlertTriangle;

  const firstMatch = result.matches[0];

  return (
    <div className="space-y-5">
      <div className="relative">
        <StickerBadge tone={badgeTone} rotate={-5} className="absolute -top-3 left-4 z-10">
          {badge}
        </StickerBadge>
        <StickerCard tone={cardTone} rotate={-0.5} size="lg" className="px-6 py-8">
          <IconSticker tone="cream" size={60} rotate={-4}>
            <Icon className="h-6 w-6 text-ink" strokeWidth={2.5} />
          </IconSticker>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight">
            {headline}
          </h2>

          {isAlert && firstMatch && (
            <div className="mt-4 space-y-1">
              <div className="text-xl font-semibold">{firstMatch.nlName}</div>
              {firstMatch.latinName && (
                <div className="text-base italic opacity-90">{firstMatch.latinName}</div>
              )}
            </div>
          )}

          {isSafe && (
            <p className="mt-3 text-base opacity-90">
              We hebben geen insectenbestanddelen of E-nummers herkend in deze
              ingrediëntenlijst.
            </p>
          )}

          {isDoubt && firstMatch?.decoderText && (
            <p className="mt-3 text-base opacity-90">{firstMatch.decoderText}</p>
          )}
        </StickerCard>
      </div>

      {/* Snippet uit etiket */}
      {firstMatch?.snippet && (
        <StickerCard tone="cream" className="p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
            Uit de ingrediëntenlijst
          </div>
          <p className="text-sm leading-relaxed text-ink/85">
            “{firstMatch.snippet}”
          </p>
        </StickerCard>
      )}

      {/* Decoder voor gevonden */}
      {isAlert && firstMatch?.decoderText && (
        <StickerCard tone="white" className="p-5">
          <h3 className="mb-2 font-display text-lg font-bold text-ink">
            Wat is dit?
          </h3>
          <p className="text-sm leading-relaxed text-ink/80">
            {firstMatch.decoderText}
          </p>
        </StickerCard>
      )}

      {isSafe && (
        <p className="px-2 text-center text-sm text-ink/65">
          Twijfel je? Controleer ook de allergeneninformatie op de verpakking.
        </p>
      )}

      {isDoubt && (
        <StickerCard tone="white" className="p-4">
          <p className="text-sm text-ink/80">
            <span className="font-semibold">Tip:</span> kijk of er een E-nummer
            naast staat, of vraag het bij de fabrikant.
          </p>
        </StickerCard>
      )}

      <FeedbackRow />

      <PillButton onClick={onReset} tone="ink" size="lg" className="w-full">
        <RotateCcw className="h-5 w-5" /> Nieuwe controle
      </PillButton>
    </div>
  );
}

function FeedbackRow() {
  const [sent, setSent] = useState<"up" | "down" | null>(null);

  if (sent) {
    return (
      <p className="text-center text-sm text-ink/65">
        Bedankt voor je feedback!
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-sm text-ink/70">Klopt dit?</span>
      <PillButton
        type="button"
        tone="cream"
        size="sm"
        onClick={() => setSent("up")}
        aria-label="Klopt"
      >
        <ThumbsUp className="h-4 w-4" /> Klopt
      </PillButton>
      <PillButton
        type="button"
        tone="cream"
        size="sm"
        onClick={() => setSent("down")}
        aria-label="Klopt niet"
      >
        <ThumbsDown className="h-4 w-4" /> Klopt niet
      </PillButton>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12 space-y-2 text-center text-[11px] leading-relaxed text-ink/55">
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
