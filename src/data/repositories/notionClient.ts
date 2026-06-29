/**
 * Shared fetch client for the server-side Notion proxy. Every Notion-backed
 * repository (leads, notes, timeline, generations) goes through here so the
 * retry/backoff policy lives in exactly one place. The browser never calls
 * `api.notion.com` directly — the proxy holds the token (see notion.ts).
 */
const PROXY_BASE_URL = "/api/notion";
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 400;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** A request failed in a way that's worth retrying (network blip, 5xx, rate limit). */
function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

/** Carries whether the failure is worth retrying, so the catch below needn't guess. */
class RequestError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
  }
}

/**
 * Fetches `path` (relative to `/api/notion`) against the proxy, retrying
 * transient failures with exponential backoff. Client errors (4xx other than
 * 429) fail immediately. A 204 resolves to `undefined` so callers returning
 * `void` (e.g. delete) work without a body.
 */
export async function proxyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: Error = new Error("Request failed");

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${PROXY_BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { error?: string });
        const message = body.error ?? `Request failed with status ${res.status}`;
        throw new RequestError(message, isRetryable(res.status));
      }

      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    } catch (err) {
      // A thrown fetch/network exception (not a RequestError) has no status
      // to consult — always worth retrying up to the attempt limit.
      const retryable = err instanceof RequestError ? err.retryable : true;
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!retryable || attempt === MAX_RETRIES) throw lastError;
    }

    await wait(RETRY_BASE_DELAY_MS * 2 ** attempt);
  }

  throw lastError;
}
