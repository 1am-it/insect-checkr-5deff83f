import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Bug, Sparkles, Check, AlertTriangle, RotateCcw } from "lucide-react";

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
      { title: "InsectAlert — Zit er insect in jouw eten?" },
      {
        name: "description",
        content:
          "Plak een ingrediëntenlijst en check direct of er insect-ingrediënten in je voedingsproduct zitten.",
      },
      { property: "og:title", content: "InsectAlert — Zit er insect in jouw eten?" },
      {
        property: "og:description",
        content: "Plak ingrediënten, krijg meteen antwoord. Gratis insect-checker.",
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
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      {/* decorative blobs */}
      <Blob tone="sun" size={280} className="-top-20 -left-16" />
      <Blob tone="mint" size={220} className="top-40 -right-20" />
      <Blob tone="coral" size={180} className="bottom-10 -left-10" />
      <Blob tone="sky" size={200} className="-bottom-16 right-10" />

      <main className="relative z-10 mx-auto w-full max-w-md px-5 pb-16 pt-10">
        <Header />

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
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <IconSticker tone="alert" size={44} rotate={-8}>
          <Bug className="h-5 w-5 text-alert-foreground" strokeWidth={2.5} />
        </IconSticker>
        <span className="font-display text-2xl font-bold text-ink">
          InsectAlert
        </span>
      </div>
      <StickerBadge tone="sun" rotate={4}>NL</StickerBadge>
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
      <div className="relative">
        <StickerBadge
          tone="alert"
          rotate={-5}
          className="absolute -top-3 left-3 z-10"
        >
          <Sparkles className="mr-1 h-3 w-3" /> Gratis
        </StickerBadge>
        <StickerCard tone="white" rotate={-1} className="px-6 py-7">
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-ink">
            Zit er <span className="italic">insect</span> in
            <br />
            jouw eten?
          </h1>
          <p className="mt-3 text-base text-ink/70">
            Plak de ingrediëntenlijst hieronder en check het in seconden.
          </p>
        </StickerCard>
      </div>

      <StickerCard tone="cream" rotate={0.5} className="p-4">
        <label htmlFor="ingredients" className="mb-2 block text-sm font-semibold text-ink">
          Ingrediënten
        </label>
        <StickerTextarea
          id="ingredients"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Bv. tarwemeel, suiker, plantaardige olie, gemalen krekel (Acheta domesticus)..."
        />
        <div className="mt-4 flex justify-end">
          <PillButton type="submit" tone="ink" size="lg" disabled={disabled}>
            Check nu
            <ArrowRight className="h-5 w-5" />
          </PillButton>
        </div>
      </StickerCard>

      <p className="text-center text-xs text-ink/60">
        Geen account nodig. Wij slaan je tekst niet op.
      </p>
    </form>
  );
}

function LoadingState() {
  return (
    <StickerCard tone="white" rotate={-1} className="px-6 py-12 text-center">
      <IconSticker tone="sun" size={72} rotate={-6} className="mx-auto animate-pulse">
        <Bug className="h-8 w-8 text-ink" strokeWidth={2.5} />
      </IconSticker>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">
        We zoeken het uit…
      </h2>
      <p className="mt-2 text-sm text-ink/70">Even geduld, dit duurt meestal een paar seconden.</p>
    </StickerCard>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StickerCard tone="white" rotate={-1} className="px-6 py-10 text-center">
      <IconSticker tone="coral" size={72} rotate={-6} className="mx-auto">
        <AlertTriangle className="h-8 w-8 text-ink" strokeWidth={2.5} />
      </IconSticker>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">Oeps — dat ging mis</h2>
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

  const headline = isAlert
    ? "Ja, dit bevat insect"
    : isSafe
    ? "Geen insect gevonden"
    : "Niet helemaal zeker";

  const sub = isAlert
    ? `We vonden ${result.matches.length} insect-ingrediënt${result.matches.length === 1 ? "" : "en"} in de lijst.`
    : isSafe
    ? "Op basis van de ingrediëntenlijst lijkt dit product geen insect te bevatten."
    : "We konden geen duidelijk antwoord geven op basis van deze tekst.";

  const badge = isAlert ? "Insect-alert" : isSafe ? "Veilig" : "Onzeker";
  const badgeTone: "alert" | "safe" | "warn" = isAlert ? "alert" : isSafe ? "safe" : "warn";
  const cardTone: "alert" | "safe" | "warn" = isAlert ? "alert" : isSafe ? "safe" : "warn";
  const Icon = isAlert ? Bug : isSafe ? Check : AlertTriangle;

  return (
    <div className="space-y-5">
      <div className="relative">
        <StickerBadge tone={badgeTone} rotate={-6} className="absolute -top-3 left-4 z-10">
          {badge}
        </StickerBadge>
        <StickerCard tone={cardTone} rotate={-1} size="lg" className="px-6 py-8">
          <IconSticker tone="cream" size={64} rotate={-4}>
            <Icon className="h-7 w-7 text-ink" strokeWidth={2.5} />
          </IconSticker>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight">
            {headline}
          </h2>
          <p className="mt-2 text-base opacity-90">{sub}</p>
        </StickerCard>
      </div>

      {result.matches.length > 0 && (
        <StickerCard tone="white" rotate={0.5} className="p-5">
          <h3 className="mb-3 font-display text-lg font-bold text-ink">
            Gevonden ingrediënten
          </h3>
          <ul className="space-y-3">
            {result.matches.map((m) => (
              <li
                key={m.id}
                className="flex gap-3 rounded-xl border-2 border-ink bg-cream px-3 py-3"
              >
                <IconSticker tone="alert" size={40} rotate={-4} className="shrink-0">
                  <Bug className="h-4 w-4 text-alert-foreground" strokeWidth={2.5} />
                </IconSticker>
                <div className="min-w-0">
                  <div className="font-semibold text-ink">{m.nlName}</div>
                  {m.latinName && (
                    <div className="text-sm italic text-ink/60">{m.latinName}</div>
                  )}
                  {m.decoderText && (
                    <p className="mt-1 text-sm text-ink/75">{m.decoderText}</p>
                  )}
                  {m.snippet && (
                    <div className="mt-2 rounded-md border border-ink/20 bg-card px-2 py-1 text-xs text-ink/70">
                      “{m.snippet}”
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </StickerCard>
      )}

      <PillButton onClick={onReset} tone="ink" size="lg" className="w-full">
        <RotateCcw className="h-5 w-5" /> Nog een product checken
      </PillButton>
    </div>
  );
}
