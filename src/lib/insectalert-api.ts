const API_BASE = "https://insect-alert.vercel.app";

export type Verdict = "contains_insect" | "no_insect" | "uncertain";

export interface ScanMatch {
  ingredient: string;
  reason?: string;
  insect_name?: string;
}

export interface ScanResult {
  verdict: Verdict;
  matches?: ScanMatch[];
  explanation?: string;
  raw?: unknown;
}

export class ScanError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

/**
 * POST /api/scan-text — backend is open-CORS.
 * Shape is permissive: we surface whatever the backend returns and
 * normalize the verdict if present.
 */
export async function scanText(text: string, signal?: AbortSignal): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) detail = String(body.error);
    } catch {}
    throw new ScanError(detail, res.status);
  }

  const data = (await res.json()) as Partial<ScanResult> & Record<string, unknown>;
  const verdict = (data.verdict as Verdict) ?? "uncertain";
  return {
    verdict,
    matches: (data.matches as ScanMatch[]) ?? [],
    explanation: (data.explanation as string) ?? undefined,
    raw: data,
  };
}
