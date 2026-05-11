const API_BASE = "https://insect-alert.vercel.app";

/**
 * Backend states observed:
 *  - "gevonden"      → insect-ingrediënt(en) gevonden
 *  - "niet-gevonden" → niets gevonden / waarschijnlijk schoon
 *  - "twijfel"       → niet zeker
 */
export type ScanState = "gevonden" | "niet-gevonden" | "twijfel";

export interface ScanMatch {
  id: string;
  type: string;
  nlName: string;
  latinName?: string;
  decoderText?: string;
  certainty?: "high" | "medium" | "low" | string;
  snippet?: string;
  pending?: boolean;
}

export interface ScanResult {
  state: ScanState;
  matches: ScanMatch[];
}

export class ScanError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function scanText(text: string, signal?: AbortSignal): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });

  if (!res.ok) {
    let detail = `Er ging iets mis (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) detail = String(body.error);
    } catch {}
    throw new ScanError(detail, res.status);
  }

  const data = (await res.json()) as Partial<ScanResult>;
  return {
    state: (data.state as ScanState) ?? "onzeker",
    matches: Array.isArray(data.matches) ? data.matches : [],
  };
}
