import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Brief "generating" transition so instant prompt generation still gets a
 * premium loading affordance (scan bar + skeleton). Mirrors the original
 * PoC's scan animation.
 */
export function useGeneratingState(duration = 600) {
  const [generating, setGenerating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = useCallback(
    (onDone: () => void) => {
      setGenerating(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onDone();
        setGenerating(false);
      }, duration);
    },
    [duration],
  );

  return { generating, run };
}
