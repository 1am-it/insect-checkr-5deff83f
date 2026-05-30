import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { PillButton } from "@/components/insectalert/PillButton";
import { QuestionResolver } from "@/components/QuestionResolver";
import { useAskMore } from "@/hooks/useAskMore";
import { cn } from "@/lib/utils";

export type AskMoreSectionProps = {
  /**
   * Optional starting text for the question field. Used to gently prefill
   * with a found ingredient (e.g. "Wat wil je weten over karmijn?").
   * Soft suggestion only — never auto-submits.
   */
  prefill?: string;
};

/**
 * Collapsible "ask more" section for under a scan result.
 *
 * Closed by default — protects the fast-scan positioning (1AM-228 UX rule:
 * optional expandable, not always visible). Click the trigger to reveal the
 * question field; answers render via the shared QuestionResolver.
 *
 * Owns no backend logic — uses the useAskMore hook (which wraps askQuestion).
 */
export function AskMoreSection({ prefill }: AskMoreSectionProps) {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState(prefill ?? "");
  const ask = useAskMore();

  const canSubmit = question.trim().length > 0 && !ask.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    ask.mutate(question.trim());
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5",
            "text-left transition-colors hover:bg-cream/60",
          )}
        >
          <span className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
            </span>
            Meer weten over dit ingrediënt?
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Bijvoorbeeld: Wat is karmijn? Of: Sinds wanneer mag dit in voeding?"
            maxLength={1000}
            rows={3}
            className="resize-y rounded-2xl"
          />
          <div>
            <PillButton type="submit" tone="ink" size="md" disabled={!canSubmit}>
              {ask.isPending ? "Bezig met analyseren…" : "Vraag stellen"}
            </PillButton>
          </div>
        </form>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {ask.isError && !ask.isPending && (
            <p className="mt-3 text-sm font-medium text-alert-accent">
              {ask.error.message}
            </p>
          )}
        </div>

        {ask.data && !ask.isPending && (
          <div className="mt-4">
            <QuestionResolver classifierResponse={ask.data} />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default AskMoreSection;
