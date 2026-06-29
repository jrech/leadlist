export interface PromptStats {
  words: number;
  chars: number;
}

/** Word + character counts for a generated prompt. */
export function promptStats(text: string): PromptStats {
  const trimmed = text.trim();
  return {
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    chars: text.length,
  };
}
