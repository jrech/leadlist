import { useCallback, useEffect, useState } from "react";

import { leadService } from "@/data/leadService";
import type { Lead } from "@/types/lead";

interface UseLeadsResult {
  /** `null` while loading or after a failed load. */
  leads: Lead[] | null;
  loading: boolean;
  /** Set when the load failed; cleared on the next successful attempt. */
  error: string | null;
  /** Re-runs the load — what a "Try again" action in the UI calls. */
  retry: () => void;
}

/**
 * Loads the full lead pipeline through `leadService` on mount (and again on
 * `retry()`). Failure leaves `leads` as `null` with `error` set, so the UI
 * can show a real synchronization-error state instead of an empty table
 * that looks like "you have zero leads."
 */
export function useLeads(): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    leadService
      .getLeads()
      .then((data) => {
        if (active) {
          setLeads(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load leads.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { leads, loading, error, retry };
}
