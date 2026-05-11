import * as React from "react";
import { Mail, Check } from "lucide-react";
import { StickerCard } from "./StickerCard";
import { StickerInput } from "./StickerInput";
import { PillButton } from "./PillButton";

const STORAGE_KEY = "insectalert.signup";

export function EmailSignup() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      setSent(true);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setSubmitting(true);
    try {
      // TODO: wire to backend endpoint when available.
      await new Promise((r) => setTimeout(r, 400));
      localStorage.setItem(STORAGE_KEY, email);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <StickerCard tone="cream" size="sm" className="p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/15">
            <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </span>
          <div>
            <div className="font-display text-base font-semibold text-ink">
              Je staat op de lijst
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              We laten je weten zodra we nieuwe checks of features uitrollen.
            </p>
          </div>
        </div>
      </StickerCard>
    );
  }

  return (
    <StickerCard tone="cream" size="sm" className="p-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-4 w-4 text-primary" strokeWidth={2.25} />
        </span>
        <div className="font-display text-base font-semibold text-ink">
          Blijf op de hoogte
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Eén mailtje per maand met nieuwe insect-ingrediënten en updates. Geen spam.
      </p>
      <form onSubmit={onSubmit} className="mt-3 space-y-2">
        <StickerInput
          type="email"
          required
          placeholder="jij@email.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PillButton
          type="submit"
          tone="ink"
          size="md"
          disabled={submitting || !email}
          className="w-full"
        >
          {submitting ? "Versturen…" : "Houd me op de hoogte"}
        </PillButton>
      </form>
    </StickerCard>
  );
}
