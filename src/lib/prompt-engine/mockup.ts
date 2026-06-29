import {
  resolveIndustry,
  resolveStyleDirection,
} from "@/lib/prompt-engine/context";
import { pickByLang } from "@/lib/prompt-engine/localize";
import {
  buildMockupPromptCs,
  buildMockupPromptEn,
  DEVICE_TEXT,
  SCOPE_TEXT,
} from "@/lib/prompt-engine/mockup.templates";
import { extractFix, extractProblem } from "@/lib/prompt-engine/parseAudit";
import type {
  IndustryId,
  Language,
  MockupDevice,
  MockupScope,
  VisualStyle,
} from "@/types/domain";

export interface MockupPromptInput {
  industry: IndustryId;
  /** Raw audit text pasted from ChatGPT (problem is extracted from it). */
  rawProblem: string;
  scope: MockupScope;
  device: MockupDevice;
  style: VisualStyle;
  lang: Language;
}

export interface MockupPromptResult {
  /** Empty when no problem could be extracted from the input. */
  prompt: string;
  problem: string;
}

/**
 * Parse the problem/fix, resolve localized data through the shared engine
 * helpers, then defer to the language-specific template. Returns an empty
 * `prompt` when no problem statement can be extracted.
 *
 * Low-level — takes the raw structured input directly. Most callers want
 * `generateMockupPrompt(lead)` from `./leads` instead.
 */
export function generateMockupPromptFromInput(
  input: MockupPromptInput,
): MockupPromptResult {
  const { industry, rawProblem, scope, device, style, lang } = input;

  const problem = extractProblem(rawProblem);
  if (!problem) return { prompt: "", problem: "" };

  const ind = resolveIndustry(industry, lang);
  const build = pickByLang(lang, {
    cs: buildMockupPromptCs,
    en: buildMockupPromptEn,
  });

  const prompt = build({
    indLabel: ind.label,
    scopeText: SCOPE_TEXT[lang][scope],
    deviceText: DEVICE_TEXT[lang][device],
    problem,
    fix: extractFix(rawProblem),
    patterns: ind.modernPattern,
    styleText: resolveStyleDirection(style, lang),
  });

  return { prompt, problem };
}
