import {
  resolveGoalDescription,
  resolveIndustry,
  resolvePlatformLabel,
} from "@/lib/prompt-engine/context";
import { pickByLang } from "@/lib/prompt-engine/localize";
import {
  buildAuditPromptCs,
  buildAuditPromptEn,
} from "@/lib/prompt-engine/audit.templates";
import type {
  AuditOutputType,
  GoalId,
  IndustryId,
  Language,
  Platform,
} from "@/types/domain";

export interface AuditPromptInput {
  industry: IndustryId;
  goal: GoalId;
  platform: Platform;
  outputType: AuditOutputType;
  lang: Language;
}

/**
 * Resolve the localized data the audit prompt needs, then defer to the
 * language-specific template. Data access and language dispatch go through
 * the shared engine helpers — no duplicated lookups here.
 *
 * Low-level — takes the raw structured input directly. Most callers want
 * `generateAuditPrompt(lead)` from `./leads` instead; this is what that
 * builds on top of, and what the standalone generator UI calls when it has
 * raw form fields instead of a lead.
 */
export function generateAuditPromptFromInput(input: AuditPromptInput): string {
  const { industry, goal, platform, outputType, lang } = input;
  const ind = resolveIndustry(industry, lang);
  const build = pickByLang(lang, {
    cs: buildAuditPromptCs,
    en: buildAuditPromptEn,
  });

  return build({
    indLabel: ind.label,
    trust: ind.trust,
    goalLabel: resolveGoalDescription(goal, lang),
    platLabel: resolvePlatformLabel(platform, lang),
    platform,
    outputType,
  });
}
