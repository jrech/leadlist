/**
 * Parsers for ChatGPT audit output. Unifies the three overlapping
 * implementations from the original PoC (parseAudit / extractProblem /
 * extractFix) into one module.
 */

export interface ParsedAudit {
  problem: string;
  impact: string;
  fix: string;
}

/** Grab the text following the first matching `KEY:` label. */
function grabSection(raw: string, keys: string[]): string {
  for (const key of keys) {
    const re = new RegExp(
      `${key}\\s*[:：]\\s*([\\s\\S]*?)(?=\\n[A-ZÁ-Ž][A-ZÁ-Ž ]+\\s*[:：]|$)`,
      "i",
    );
    const match = raw.match(re);
    if (match && match[1].trim()) {
      return match[1].trim().replace(/\s+/g, " ");
    }
  }
  return "";
}

/** Fallback when no labelled sections are found: first two sentences. */
function firstSentences(raw: string): string {
  return raw
    .trim()
    .split(/\n\n|\. /)
    .slice(0, 2)
    .join(". ")
    .trim();
}

const PROBLEM_KEYS = ["PROBLEM", "PROBLÉM"];
const IMPACT_KEYS = ["BUSINESS IMPACT", "IMPACT", "DOPAD"];
const FIX_KEYS = ["QUICK FIX", "FIX", "QUICK WIN", "ŘEŠENÍ", "OPRAVA"];

/** Full structured parse used by the email composer. */
export function parseAudit(raw: string): ParsedAudit {
  const problem = grabSection(raw, PROBLEM_KEYS) || firstSentences(raw);
  return {
    problem,
    impact: grabSection(raw, IMPACT_KEYS),
    fix: grabSection(raw, FIX_KEYS),
  };
}

/** Extract just the problem statement (used by the mockup prompt). */
export function extractProblem(raw: string): string {
  if (!raw.trim()) return "";
  return grabSection(raw, PROBLEM_KEYS) || firstSentences(raw);
}

/** Extract just the fix direction (used by the mockup prompt). */
export function extractFix(raw: string): string {
  return grabSection(raw, FIX_KEYS);
}
