import { useMutation } from "@tanstack/react-query";
import { askQuestion, type ClassifierResponse } from "@/lib/insectalert-api";

/**
 * Hook for the "ask more" follow-up question flow.
 *
 * Wraps askQuestion() in a TanStack Query mutation — consistent with the
 * scan flow in index.tsx (which uses useMutation for scanText/scanPhoto).
 * The hook owns loading/error/data state; QuestionResolver only renders.
 *
 * Knows nothing about backend URLs — that lives in the API layer.
 *
 * Usage:
 *   const ask = useAskMore();
 *   ask.mutate("Wat is karmijn?");
 *   ask.isPending / ask.isError / ask.error / ask.data
 */
export function useAskMore() {
  return useMutation<ClassifierResponse, Error, string>({
    mutationFn: (question: string) => askQuestion(question.trim()),
  });
}
