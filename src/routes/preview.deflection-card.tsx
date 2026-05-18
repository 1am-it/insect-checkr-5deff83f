import { createFileRoute } from "@tanstack/react-router";
import { DeflectionCard, type DeflectionCardProps } from "@/components/DeflectionCard";

export const Route = createFileRoute("/preview/deflection-card")({
  head: () => ({
    meta: [
      { title: "Preview — DeflectionCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewDeflectionCardPage,
});

const fixtures: Array<{
  label: string;
  props: DeflectionCardProps;
}> = [
  {
    label: "1. HVN (halal)",
    props: { dataQuery: { topicType: "halal" }, deflectionTarget: "HVN" },
  },
  {
    label: "2. huisarts (medical_personal)",
    props: { dataQuery: { topicType: "medical_personal" }, deflectionTarget: "huisarts" },
  },
  {
    label: "3. huisartsenpost (medical_acute — URGENT)",
    props: { dataQuery: { topicType: "medical_acute" }, deflectionTarget: "huisartsenpost" },
  },
  {
    label: "4. Voedingscentrum (nutrition)",
    props: { dataQuery: { topicType: "nutrition" }, deflectionTarget: "Voedingscentrum" },
  },
  {
    label: "5. NVWA (enforcement)",
    props: { dataQuery: { topicType: "enforcement" }, deflectionTarget: "NVWA" },
  },
  {
    label: "6. scan-product (product_database — secondary action)",
    props: { dataQuery: { topicType: "product_database" }, deflectionTarget: "scan-product" },
  },
  {
    label: "7. recipe-out-of-scope (recipe — secondary action)",
    props: { dataQuery: { topicType: "recipe" }, deflectionTarget: "recipe-out-of-scope" },
  },
  {
    label: "8. foreign-authority (foreign_jurisdiction)",
    props: {
      dataQuery: { topicType: "foreign_jurisdiction" },
      deflectionTarget: "foreign-authority",
    },
  },
];

function PreviewDeflectionCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            DeflectionCard fixtures
          </h1>
          <p className="text-sm text-muted-foreground">
            Visuele verificatie van <code>DeflectionCard</code> met acht doelen.
          </p>
        </header>

        {fixtures.map((f, i) => (
          <section key={i} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground">{f.label}</p>
            <DeflectionCard {...f.props} />
          </section>
        ))}
      </div>
    </main>
  );
}
