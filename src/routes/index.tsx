import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
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
  Camera,
  Type,
  ImagePlus,
  X,
} from "lucide-react";

import { StickerCard } from "@/components/insectalert/StickerCard";
import { PillButton } from "@/components/insectalert/PillButton";
import { IconSticker } from "@/components/insectalert/IconSticker";
import { StickerTextarea } from "@/components/insectalert/StickerInput";
import { EmailSignup } from "@/components/insectalert/EmailSignup";
import { scanText, scanPhoto, type ScanResult } from "@/lib/insectalert-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InsectAlert — Bevat dit product insecten?" },
      {
        name: "description",
        content:
          "Plak een Nederlandse ingrediëntenlijst of maak een foto van het etiket en check of er insect-ingrediënten in een voedingsproduct zitten. Voor vegetariërs, halal-consumenten en mensen met een schaaldierenallergie.",
      },
      { property: "og:title", content: "InsectAlert — Bevat dit product insecten?" },
      {
        property: "og:description",
        content:
          "Plak ingrediënten of upload een foto, krijg meteen antwoord. Voor vegetariërs, halal en allergieën.",
      },
    ],
  }),
  component: Index,
});

type Mode = "paste" | "photo";

type ScanInput = { kind: "text"; text: string } | { kind: "photo"; blob: Blob };

function Index() {
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

  const mutation = useMutation<ScanResult, Error, ScanInput>({
    mutationFn: (input) =>
      input.kind === "text" ? scanText(input.text) : scanPhoto(input.blob),
  });

  const reset = () => {
    mutation.reset();
    setText("");
    setPhotoBlob(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const switchToText = () => {
    mutation.reset();
    setPhotoBlob(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setMode("paste");
  };

  const onSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 3) return;
    mutation.mutate({ kind: "text", text: text.trim() });
  };

  const onSubmitPhoto = () => {
    if (!photoBlob) return;
    mutation.mutate({ kind: "photo", blob: photoBlob });
  };

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pb-10 pt-8">
        <Header />

        <div className="flex-1">
          {mutation.isPending ? (
            <LoadingState mode={mode} />
          ) : mutation.isError ? (
            <ErrorState
              message={mutation.error.message}
              onRetry={reset}
              onSwitchToText={mode === "photo" ? switchToText : undefined}
            />
          ) : mutation.data ? (
            <ResultState result={mutation.data} onReset={reset} />
          ) : (
            <>
              <Intro />
              <ModeSwitch mode={mode} setMode={setMode} />
              {mode === "paste" ? (
                <PasteForm
                  text={text}
                  setText={setText}
                  onSubmit={onSubmitText}
                  disabled={text.trim().length < 3}
                />
              ) : (
                <PhotoForm
                  preview={photoPreview}
                  setPreview={setPhotoPreview}
                  setBlob={setPhotoBlob}
                  onSubmit={onSubmitPhoto}
                  hasPhoto={!!photoBlob}
                />
              )}
              <Disclaimer />
            </>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-8 flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <Leaf className="h-4 w-4 text-primary" strokeWidth={2.25} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">
        Insect<span className="text-primary"> alert</span>
      </span>
    </header>
  );
}

function Intro() {
  return (
    <div className="mb-6 space-y-3">
      <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-tight text-ink">
        Bevat dit product insecten?
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Plak de ingrediëntenlijst of maak een foto van het etiket. We laten
        het je zien.
      </p>
    </div>
  );
}

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="mb-5 inline-flex w-full rounded-full border border-border bg-card p-1">
      <button
        type="button"
        onClick={() => setMode("paste")}
        className={cn(
          "flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          mode === "paste" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-ink",
        )}
      >
        <Type className="h-3.5 w-3.5" /> Plakken
      </button>
      <button
        type="button"
        onClick={() => setMode("photo")}
        className={cn(
          "flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          mode === "photo" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-ink",
        )}
      >
        <Camera className="h-3.5 w-3.5" /> Foto
      </button>
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
    <form onSubmit={onSubmit}>
      <StickerCard tone="white" className="p-5">
        <label
          htmlFor="ingredients"
          className="mb-2.5 block px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Ingrediëntenlijst
        </label>
        <StickerTextarea
          id="ingredients"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Plak hier de ingrediëntenlijst van het product..."
          className="border-0 bg-transparent px-2 py-0 focus:ring-0 focus:border-transparent"
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
    </form>
  );
}

function PhotoForm({
  preview,
  setPreview,
  setBlob,
  onSubmit,
  hasPhoto,
}: {
  preview: string | null;
  setPreview: (s: string | null) => void;
  setBlob: (b: Blob | null) => void;
  onSubmit: () => void;
  hasPhoto: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErr(null);
    setBusy(true);
    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 1024,
        initialQuality: 0.85,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(compressed));
      setBlob(compressed);
    } catch (e) {
      setErr("Kon deze foto niet verwerken. Probeer een andere.");
    } finally {
      setBusy(false);
    }
  };

  const clearPhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setBlob(null);
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  return (
    <StickerCard tone="white" className="p-5">
      <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Foto van het etiket
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-cream">
          <img src={preview} alt="Etiket voorbeeld" className="block max-h-72 w-full object-contain" />
          <button
            type="button"
            onClick={clearPhoto}
            aria-label="Foto verwijderen"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-ink shadow-sm hover:bg-card"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-cream/60 px-4 py-8 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ImagePlus className="h-5 w-5 text-primary" strokeWidth={2.25} />
          </span>
          <p className="mt-3 text-sm text-muted-foreground">
            {busy ? "Foto klaarmaken…" : "Kies een foto van de ingrediëntenlijst"}
          </p>
        </div>
      )}

      {err && <p className="mt-3 text-sm text-alert-accent">{err}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      {!preview ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <PillButton type="button" tone="cream" size="md" onClick={() => cameraRef.current?.click()}>
            <Camera className="h-4 w-4" /> Camera
          </PillButton>
          <PillButton type="button" tone="cream" size="md" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> Galerij
          </PillButton>
        </div>
      ) : (
        <div className="mt-4 border-t border-border/60 pt-4">
          <PillButton
            type="button"
            tone="ink"
            size="lg"
            disabled={!hasPhoto || busy}
            onClick={onSubmit}
            className="w-full"
          >
            Controleer foto
            <ArrowRight className="h-4 w-4" />
          </PillButton>
        </div>
      )}
    </StickerCard>
  );
}

function Disclaimer() {
  return (
    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
      InsectAlert geeft informatie op basis van door jou verstrekte gegevens.
      Controleer bij twijfel altijd het originele etiket of neem contact op
      met de fabrikant.
    </p>
  );
}

function LoadingState({ mode }: { mode: Mode }) {
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
        {mode === "photo"
          ? "We lezen het etiket. Dit duurt 2–4 seconden."
          : "Dit duurt meestal maar een paar seconden."}
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  onSwitchToText,
}: {
  message: string;
  onRetry: () => void;
  onSwitchToText?: () => void;
}) {
  return (
    <StickerCard tone="white" className="px-6 py-10 text-center">
      <IconSticker tone="warn" size={56} className="mx-auto">
        <AlertCircle className="h-6 w-6" style={{ color: "var(--warn-accent)" }} strokeWidth={2} />
      </IconSticker>
      <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
        Hmm, dat ging niet goed
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-col gap-2">
        <PillButton onClick={onRetry} tone="ink" size="md">
          <RotateCcw className="h-4 w-4" /> Probeer opnieuw
        </PillButton>
        {onSwitchToText && (
          <PillButton onClick={onSwitchToText} tone="cream" size="md">
            <Type className="h-4 w-4" /> Plak tekst in plaats daarvan
          </PillButton>
        )}
      </div>
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

          {isDoubt && (
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">
              {firstMatch?.decoderText ??
                "Er staat iets in de lijst dat we niet zeker kunnen plaatsen. Mogelijk een insect-ingrediënt, mogelijk niet."}
            </p>
          )}
        </div>
      </StickerCard>

      {firstMatch?.snippet && (
        <div>
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Uit de ingrediëntenlijst
          </div>
          <StickerCard tone="cream" size="sm" className="p-4">
            <p className="text-sm leading-relaxed text-ink/80">
              "{firstMatch.snippet}"
            </p>
          </StickerCard>
        </div>
      )}

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

      <EmailSignup />

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
