const API_BASE = "https://insect-alert.vercel.app";

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

/**
 * Classifier response shape for the "ask more" follow-up question flow.
 * Returned by POST /api/classify-question. Consumed by QuestionResolver
 * (which routes `component` to the right card) and the useAskMore hook.
 *
 * Lives here, in the API layer, so the dependency direction is
 * component/hook → API (not API → component).
 */
export type ClassifierResponse = {
  category: "decoder" | "regulation" | "deflection" | "ambiguous";
  component:
    | "decoder-card"
    | "list-card"
    | "timeline-card"
    | "deflection-card"
    | "clarification-card";
  dataQuery: Record<string, unknown>;
  deflectionTarget: string | null;
  confidence: "high" | "medium" | "low";
};

export class ScanError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function parseOrThrow(res: Response): Promise<ScanResult> {
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
    state: (data.state as ScanState) ?? "twijfel",
    matches: Array.isArray(data.matches) ? data.matches : [],
  };
}

export async function scanText(text: string, signal?: AbortSignal): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });
  return parseOrThrow(res);
}

export interface SignupResult {
  ok: true;
  alreadySignedUp?: boolean;
}

export async function signupEmail(email: string, signal?: AbortSignal): Promise<SignupResult> {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    signal,
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {}
  if (!res.ok) {
    const code = body?.error === "invalid_email" ? 400 : res.status;
    const msg =
      body?.message ||
      (body?.error === "invalid_email"
        ? "Dit lijkt geen geldig e-mailadres."
        : "Er ging iets mis. Probeer het zo nog eens.");
    throw new ScanError(msg, code);
  }
  return { ok: true, alreadySignedUp: !!body?.alreadySignedUp };
}

export async function scanPhoto(blob: Blob, signal?: AbortSignal): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan-photo`, {
    method: "POST",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
    signal,
  });
  return parseOrThrow(res);
}

/**
 * Ask a follow-up question about an ingredient or EU regulation.
 * Returns a ClassifierResponse that QuestionResolver renders into a card.
 * Same backend base as the scan endpoints — single source of truth.
 */
export async function askQuestion(
  question: string,
  signal?: AbortSignal,
): Promise<ClassifierResponse> {
  const res = await fetch(`${API_BASE}/api/classify-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!res.ok) {
    let detail = "De vraag kon niet worden geanalyseerd. Probeer het zo nog eens.";
    try {
      const body = await res.json();
      if (body?.message) detail = String(body.message);
    } catch {}
    throw new ScanError(detail, res.status);
  }
  return (await res.json()) as ClassifierResponse;
}
