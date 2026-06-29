import { useCallback, useEffect, useRef, useState } from "react";

import type { GenerationStatus } from "@/types/generationState";

interface UseGenerationStateOptions<T> {
  /**
   * Identifies the record this machine is hydrating from (e.g. a lead id).
   * Changing this hard-resets to idle/generated from `initialValue` — for
   * genuinely switching to a different record while a component instance
   * is reused. It is NOT what makes first-load hydration work (see below).
   */
  resetKey: string;
  /**
   * Persisted value to hydrate from, e.g. a generation loaded from storage.
   * This commonly arrives *after* mount (the fetch resolves once the
   * component is already idle) — the machine watches for that and
   * hydrates automatically as long as it's still idle, so callers don't
   * need to manually re-derive a "did the real data just arrive" key.
   */
  initialValue?: T | null;
  /** Runs the actual generation and returns the new value. */
  generate: () => Promise<T>;
  /** Persists an edited value. Omit if a module has nothing to save (Mockup). */
  save?: (value: T) => Promise<void> | void;
}

export interface GenerationStateApi<T> {
  status: GenerationStatus;
  value: T | null;
  error: string | null;
  generate: () => Promise<void>;
  edit: (value: T) => void;
  save: () => Promise<void>;
  reset: () => void;
}

function hydratedStatus<T>(value: T | null): GenerationStatus {
  return value !== null ? "generated" : "idle";
}

/**
 * The one state machine every AI module (Audit, Mockup, Email, and any
 * future one) is built on. Generic over the value type so a single-string
 * prompt (Audit/Mockup) and a richer shape (Email's variant array) both fit
 * without duplicating the lifecycle logic per module.
 */
export function useGenerationState<T>({
  resetKey,
  initialValue = null,
  generate: runGenerate,
  save: runSave,
}: UseGenerationStateOptions<T>): GenerationStateApi<T> {
  const [status, setStatus] = useState<GenerationStatus>(
    hydratedStatus(initialValue),
  );
  const [value, setValue] = useState<T | null>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const lastResetKey = useRef(resetKey);
  const statusRef = useRef(status);
  statusRef.current = status;

  // Hard reset when switching to a genuinely different record (e.g. a
  // different lead) while this component instance is reused.
  useEffect(() => {
    if (resetKey !== lastResetKey.current) {
      lastResetKey.current = resetKey;
      setValue(initialValue);
      setStatus(hydratedStatus(initialValue));
      setError(null);
    }
    // initialValue is intentionally not a dependency here — see the
    // idle-hydration effect below for why it has its own, narrower watch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // The persisted record commonly finishes loading *after* this machine has
  // already mounted idle (the fetch resolves a tick later than the first
  // render). Hydrate whenever that happens — but only while still idle, so
  // an unrelated prop change can never clobber in-progress work.
  useEffect(() => {
    if (statusRef.current === "idle" && initialValue !== null) {
      setValue(initialValue);
      setStatus("generated");
    }
  }, [initialValue]);

  const generate = useCallback(async () => {
    setStatus("generating");
    setError(null);
    try {
      const result = await runGenerate();
      setValue(result);
      setStatus("generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("failed");
    }
  }, [runGenerate]);

  const edit = useCallback((next: T) => {
    setValue(next);
    setStatus("edited");
  }, []);

  const save = useCallback(async () => {
    if (value === null) return;
    try {
      await runSave?.(value);
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("failed");
    }
  }, [value, runSave]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setStatus(hydratedStatus(initialValue));
    setError(null);
  }, [initialValue]);

  return { status, value, error, generate, edit, save, reset };
}
