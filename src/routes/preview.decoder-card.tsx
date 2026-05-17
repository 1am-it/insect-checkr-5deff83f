import { createFileRoute } from "@tanstack/react-router";
import { DecoderCard, type DecoderCardProps } from "@/components/DecoderCard";

export const Route = createFileRoute("/preview/decoder-card")({
  head: () => ({
    meta: [
      { title: "Preview — DecoderCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewDecoderCardPage,
});

const fixtures: Array<{ label: string; query: DecoderCardProps["dataQuery"] }> = [
  {
    label: "lookup: 'id', value: 'karmijn'",
    query: { lookup: "id", value: "karmijn" },
  },
  {
    label: "lookup: 'eNumber', value: 'E120'",
    query: { lookup: "eNumber", value: "E120" },
  },
  {
    label: "lookup: 'id', value: 'huiskrekel'",
    query: { lookup: "id", value: "huiskrekel" },
  },
  {
    label: "lookup: 'synonym', value: 'cochineal'",
    query: { lookup: "synonym", value: "cochineal" },
  },
  {
    label: "lookup: 'id', value: 'nonsense-xyz'",
    query: { lookup: "id", value: "nonsense-xyz" },
  },
];

function PreviewDecoderCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            DecoderCard fixtures
          </h1>
          <p className="text-sm text-muted-foreground">
            Visuele verificatie van <code>DecoderCard</code> met vijf inputs.
          </p>
        </header>

        {fixtures.map((f, i) => (
          <section key={i} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground">
              #{i + 1} — {f.label}
            </p>
            <DecoderCard dataQuery={f.query} />
          </section>
        ))}
      </div>
    </main>
  );
}
