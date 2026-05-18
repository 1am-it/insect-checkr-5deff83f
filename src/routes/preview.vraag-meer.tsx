import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  QuestionResolver,
  type ClassifierResponse,
} from "@/components/QuestionResolver";
import { Textarea } from "@/components/ui/textarea";
import { PillButton } from "@/components/insectalert/PillButton";

export const Route = createFileRoute("/preview/vraag-meer")({
  head: () => ({
    meta: [
      { title: "Preview — Vraag meer" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewVraagMeerPage,
});

function PreviewVraagMeerPage() {
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [response, setResponse] = React.useState<ClassifierResponse | null>(null);

  const canSubmit = question.trim().length > 0 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    const apiBase =
      import.meta.env.VITE_API_BASE_URL ?? "https://insect-alert.vercel.app";

    try {
      const res = await fetch(`${apiBase}/api/classify-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!res.ok) {
        try {
          const errBody = await res.json();
          setError(errBody.message ?? "Onbekende fout van de backend.");
        } catch {
          setError(
            "De vraag kon niet worden geanalyseerd. Controleer of de backend draait.",
          );
        }
        setLoading(false);
        return;
      }

      const data: ClassifierResponse = await res.json();
      setResponse(data);
    } catch {
      setError(
        "De vraag kon niet worden geanalyseerd. Controleer of de backend draait.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Vraag meer (preview)
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Stel een vraag over een ingrediënt of EU-regelgeving.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Bijvoorbeeld: Wat is karmijn? Of: Mag ik dit als moslim eten?"
            maxLength={1000}
            className="min-h-[80px] resize-y rounded-2xl"
          />
          <div>
            <PillButton
              type="submit"
              tone="ink"
              size="md"
              disabled={!canSubmit}
            >
              Vraag stellen
            </PillButton>
          </div>
        </form>

        <div aria-live="polite" className="min-h-[1.5rem]">
          {loading && (
            <p className="text-sm text-muted-foreground">Bezig met analyseren...</p>
          )}
          {error && !loading && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </div>

        {response && !loading && (
          <section className="flex flex-col gap-3">
            <QuestionResolver classifierResponse={response} />
          </section>
        )}
      </div>
    </main>
  );
}
