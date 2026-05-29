import { createFileRoute } from "@tanstack/react-router";
import {
  ClarificationCard,
  type ClarificationCardProps,
} from "@/components/ClarificationCard";

export const Route = createFileRoute("/preview/clarification-card")({
  head: () => ({
    meta: [
      { title: "Preview — ClarificationCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewClarificationCardPage,
});

const fixtures: Array<{ label: string; props: ClarificationCardProps }> = [
  {
    label: "1. 'Is meelworm gezond?' — gezondheid vs toelating",
    props: {
      dataQuery: {
        originalQuestion: "Is meelworm gezond?",
        interpretations: [
          {
            label: "Voedingswaarde van meelworm",
            rewrittenQuestion: "Wat is de voedingswaarde van gele meelworm?",
          },
          {
            label: "Is meelworm veilig om te eten?",
            rewrittenQuestion: "Is gele meelworm in de EU toegelaten als voedsel?",
          },
          {
            label: "Allergische reacties",
            rewrittenQuestion: "Kan ik allergisch zijn voor meelworm?",
          },
        ],
      },
    },
  },
  {
    label: "2. 'Karmijn — gevaarlijk of veilig?'",
    props: {
      dataQuery: {
        originalQuestion: "Karmijn — gevaarlijk of veilig?",
        interpretations: [
          {
            label: "Wat is karmijn (E120)?",
            rewrittenQuestion: "Wat is karmijn (E120)?",
          },
          {
            label: "Allergie of bijwerkingen",
            rewrittenQuestion: "Kan karmijn (E120) allergische reacties veroorzaken?",
          },
          {
            label: "EU-toelating",
            rewrittenQuestion: "Is karmijn (E120) toegelaten in EU-voedsel?",
          },
        ],
      },
    },
  },
  {
    label: "3. 'Hoe zit dat?' — te vaag",
    props: {
      dataQuery: {
        originalQuestion: "Hoe zit dat?",
        interpretations: [
          {
            label: "Insecten in voedsel algemeen",
            rewrittenQuestion: "Welke insecten zijn in de EU toegelaten in voedsel?",
          },
          {
            label: "Etikettering",
            rewrittenQuestion: "Hoe herken ik insecten op een etiket?",
          },
        ],
      },
    },
  },
  {
    label: "4. Edge case — geen interpretaties",
    props: {
      dataQuery: {
        originalQuestion: "???",
        interpretations: [],
      },
    },
  },
];

function PreviewClarificationCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            ClarificationCard fixtures
          </h1>
          <p className="text-sm text-muted-foreground">
            Visuele verificatie van <code>ClarificationCard</code> met vier
            scenario's. Pill-klik roept{" "}
            <code>/api/classify-question</code> opnieuw aan.
          </p>
        </header>

        {fixtures.map((f, i) => (
          <section key={i} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground">{f.label}</p>
            <ClarificationCard
              {...f.props}
              onResolved={(response, chosen) => {
                // eslint-disable-next-line no-console
                console.log("[ClarificationCard] resolved", { chosen, response });
              }}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
