import { useCallback, useEffect, useState } from "react";

import { healthService } from "@/data/healthService";
import type { WorkspaceHealth } from "@/data/repositories/types";

interface UseHealthResult {
  /** `null` only during the very first load. */
  health: WorkspaceHealth | null;
  /** True during the initial check (renders skeletons). */
  loading: boolean;
  /** True while a manual "Health Check" re-run is in flight. */
  checking: boolean;
  /** Re-runs the check — what the "Health Check" button calls. */
  refresh: () => void;
}

/**
 * Checks workspace health through `healthService` on mount and on demand.
 * A thrown request (proxy server down) is turned into an `error` snapshot so
 * the widget always shows a concrete state instead of crashing.
 */
export function useHealth(): UseHealthResult {
  const [health, setHealth] = useState<WorkspaceHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const run = useCallback(async (initial: boolean) => {
    if (initial) setLoading(true);
    else setChecking(true);
    try {
      setHealth(await healthService.check());
    } catch {
      setHealth({
        status: "error",
        notionConnected: false,
        checkedAt: new Date().toISOString(),
        message: "Proxy server unreachable.",
      });
    } finally {
      if (initial) setLoading(false);
      else setChecking(false);
    }
  }, []);

  useEffect(() => {
    run(true);
  }, [run]);

  return { health, loading, checking, refresh: () => run(false) };
}
