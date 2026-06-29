import { useCallback, useEffect, useRef, useState } from "react";

import { leadService } from "@/data/leadService";
import type { NewLead } from "@/data/repositories/types";
import type { Lead } from "@/types/lead";

interface UseLeadResult {
  /** `undefined` while loading, `null` if not found or the load failed. */
  lead: Lead | null | undefined;
  loading: boolean;
  /** Set when the load, an update, or an archive failed. */
  error: string | null;
  /** Re-runs the initial load — what a "Try again" action calls. */
  retry: () => void;
  updateLead: (patch: Partial<NewLead>) => Promise<Lead | undefined>;
  archiveLead: () => Promise<Lead | undefined>;
}

/**
 * Loads a single lead through `leadService` and exposes `updateLead` /
 * `archiveLead` so actions taken in the workspace (status changes, "Mark as
 * Sent", archiving, notes) write back through the same service everything
 * else reads from — there's only ever one source of truth for a lead's
 * state.
 *
 * Both mutators are optimistic: the change applies to local state
 * immediately, before the network round-trip resolves. On failure they roll
 * back to the pre-edit snapshot and surface `error` — an edit that didn't
 * actually save is never silently kept on screen.
 */
export function useLead(leadId: string | undefined): UseLeadResult {
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Mirrors `lead` without being a dependency of the callbacks below, so
  // updateLead/archiveLead stay referentially stable across renders while
  // still reading the freshest value for their rollback snapshot.
  const leadRef = useRef(lead);
  useEffect(() => {
    leadRef.current = lead;
  }, [lead]);

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      return;
    }
    let active = true;
    setLead(undefined);
    setError(null);

    leadService
      .getLead(leadId)
      .then((data) => {
        if (active) setLead(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load this lead.");
          setLead(null);
        }
      });

    return () => {
      active = false;
    };
  }, [leadId, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const updateLead = useCallback(
    async (patch: Partial<NewLead>) => {
      if (!leadId) return;
      const snapshot = leadRef.current;
      setLead((current) => (current ? { ...current, ...patch } : current));
      setError(null);
      try {
        const updated = await leadService.updateLead(leadId, patch);
        setLead(updated);
        return updated;
      } catch (err) {
        setLead(snapshot);
        setError(err instanceof Error ? err.message : "Failed to save changes.");
        throw err;
      }
    },
    [leadId],
  );

  const archiveLead = useCallback(async () => {
    if (!leadId) return;
    const snapshot = leadRef.current;
    setError(null);
    try {
      const updated = await leadService.archiveLead(leadId);
      setLead(updated);
      return updated;
    } catch (err) {
      setLead(snapshot);
      setError(err instanceof Error ? err.message : "Failed to archive lead.");
      throw err;
    }
  }, [leadId]);

  return { lead, loading: lead === undefined, error, retry, updateLead, archiveLead };
}
