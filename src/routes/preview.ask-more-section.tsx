import { createFileRoute } from "@tanstack/react-router";
import { AskMoreSection } from "@/components/AskMoreSection";

export const Route = createFileRoute("/preview/ask-more-section")({
  head: () => ({
    meta: [
      { title: "Preview — AskMoreSection" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewAskMoreSectionPage,
});

function PreviewAskMoreSectionPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">
            AskMoreSection (preview)
          </h1>
          <p className="text-sm text-muted-foreground">
            Standalone test van de collapsible vraag-meer sectie, vóór
            integratie in de scan-resultaatflow.
          </p>
        </header>

        {/* Zonder prefill — zoals onder een "niet-gevonden" resultaat */}
        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Zonder prefill
          </p>
          <AskMoreSection />
        </section>

        {/* Met prefill — zoals onder een "gevonden" resultaat (Fase 5) */}
        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Met prefill ("karmijn")
          </p>
          <AskMoreSection prefill="Wat is karmijn?" />
        </section>
      </div>
    </main>
  );
}
