import { useCallback, useRef, useState } from "react";

import { copyToClipboard } from "@/lib/clipboard";

interface UseCopyToClipboardResult {
  /** True for `resetDelay` ms after a successful copy. */
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Copy helper with transient "copied" state for button feedback.
 * Replaces the PoC's manual innerHTML/setTimeout flash logic.
 */
export function useCopyToClipboard(
  resetDelay = 2000,
): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string) => {
      try {
        await copyToClipboard(text);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay],
  );

  return { copied, copy };
}
