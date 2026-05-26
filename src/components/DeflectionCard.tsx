import * as React from "react";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { PillButton } from "@/components/insectalert/PillButton";
import { cn } from "@/lib/utils";

export type DeflectionCardProps = {
  dataQuery: {
    topicType:
      | "halal"
      | "medical_personal"
      | "medical_acute"
      | "nutrition"
      | "enforcement"
      | "product_database"
      | "recipe"
      | "foreign_jurisdiction"
      | "organic";
  };
  deflectionTarget:
    | "HVN"
    | "huisarts"
    | "huisartsenpost"
    | "Voedingscentrum"
    | "NVWA"
    | "scan-product"
    | "recipe-out-of-scope"
    | "foreign-authority";
};

type DeflectionConfig = {
  displayName: string | null;
  reason: string;
  hasExternalLink: boolean;
  externalUrl: string | null;
  ctaLabel: string | null;
  urgent: boolean;
  secondaryAction: {
    label: string;
    action: "open-scanner" | "go-back";
  } | null;
};

const DEFLECTION_MAP: Record<string, DeflectionConfig> = {
  HVN: {
    displayName: "Halal Voeding Nederland",
    reason: "voor halal-certificering en religieuze interpretatie",
    hasExternalLink: true,
    externalUrl: "https://www.ikeethalal.nl",
    ctaLabel: "Bezoek Halal Voeding Nederland",
    urgent: false,
    secondaryAction: null,
  },
  huisarts: {
    displayName: "Huisarts of Allergologievereniging",
    reason: "voor persoonlijk medisch advies",
    hasExternalLink: true,
    externalUrl: "https://www.thuisarts.nl",
    ctaLabel: "Bekijk medisch advies",
    urgent: false,
    secondaryAction: null,
  },
  huisartsenpost: {
    displayName: "Huisartsenpost of 112",
    reason: "bij acute klachten of ademhalingsproblemen — bel direct",
    hasExternalLink: true,
    externalUrl: "https://www.huisartsenspoedposten.nl",
    ctaLabel: "Zoek direct hulp",
    urgent: true,
    secondaryAction: null,
  },
  Voedingscentrum: {
    displayName: "Voedingscentrum",
    reason: "voor algemeen voedingsadvies",
    hasExternalLink: true,
    externalUrl: "https://www.voedingscentrum.nl",
    ctaLabel: "Bekijk Voedingscentrum",
    urgent: false,
    secondaryAction: null,
  },
  NVWA: {
    displayName: "NVWA",
    reason: "voor handhaving en etikettering",
    hasExternalLink: true,
    externalUrl: "https://www.nvwa.nl",
    ctaLabel: "Bekijk NVWA-informatie",
    urgent: false,
    secondaryAction: null,
  },
  "scan-product": {
    displayName: null,
    reason:
      "InsectAlert scant het product dat jij voor je hebt — geen productdatabase",
    hasExternalLink: false,
    externalUrl: null,
    ctaLabel: null,
    urgent: false,
    secondaryAction: { label: "Scan een etiket", action: "open-scanner" },
  },
  "recipe-out-of-scope": {
    displayName: null,
    reason:
      "InsectAlert legt uit wat een ingrediënt is — geen recepten of alternatieven",
    hasExternalLink: false,
    externalUrl: null,
    ctaLabel: null,
    urgent: false,
    secondaryAction: { label: "Terug naar scanner", action: "go-back" },
  },
  "foreign-authority": {
    displayName: null,
    reason:
      "voor regelgeving buiten de EU verschilt per land — raadpleeg de lokale voedselautoriteit",
    hasExternalLink: false,
    externalUrl: null,
    ctaLabel: null,
    urgent: false,
    secondaryAction: null,
  },
};

const PREFIX_OMITTED_TARGETS = new Set([
  "scan-product",
  "recipe-out-of-scope",
  "foreign-authority",
]);

function CategoryPill({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "alert" | "muted";
}) {
  const toneClass =
    tone === "alert"
      ? "bg-alert-accent text-primary-foreground"
      : tone === "muted"
      ? "bg-muted text-muted-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StickerCard tone="white" size="lg" className="relative overflow-hidden p-6 sm:p-8">
      <Blob tone="sun" size={140} className="-right-10 -top-10 opacity-50" />
      <Blob tone="mint" size={100} className="-bottom-8 -left-8 opacity-40" />
      <div className="relative z-10 flex flex-col gap-4">{children}</div>
    </StickerCard>
  );
}

export function DeflectionCard({ deflectionTarget }: DeflectionCardProps) {
  const config = DEFLECTION_MAP[deflectionTarget];

  if (!config) {
    return null;
  }

  const omitPrefix = PREFIX_OMITTED_TARGETS.has(deflectionTarget);
  const bodyText = omitPrefix
    ? config.reason
    : `InsectAlert legt uit wat een ingrediënt is en hoe het binnen EU-regelgeving valt. ${config.reason}.`;

  const handleSecondary = () => {
    if (!config.secondaryAction) return;
    if (config.secondaryAction.action === "open-scanner") {
      window.location.assign("/");
    } else if (config.secondaryAction.action === "go-back") {
      window.history.back();
    }
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-2">
        {config.urgent ? (
          <CategoryPill tone="alert">Acuut</CategoryPill>
        ) : (
          <CategoryPill tone="muted">Doorverwijzing</CategoryPill>
        )}
      </div>

      {config.displayName && (
        <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {config.displayName}
        </h2>
      )}

      <p className="text-sm leading-relaxed text-ink/85 sm:text-base">{bodyText}</p>

      {config.hasExternalLink && config.externalUrl && config.ctaLabel && (
        <div>
          <a
            href={config.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <PillButton
              tone={config.urgent ? "alert" : "ink"}
              size="md"
              type="button"
            >
              {config.ctaLabel}
            </PillButton>
          </a>
        </div>
      )}

      {config.secondaryAction && (
        <div>
          <PillButton
            tone="cream"
            size="sm"
            type="button"
            onClick={handleSecondary}
          >
            {config.secondaryAction.label}
          </PillButton>
        </div>
      )}
    </Shell>
  );
}

export default DeflectionCard;
