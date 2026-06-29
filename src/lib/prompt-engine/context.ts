import { COUNTRIES_MAP } from "@/data/countries";
import { DEFAULT_GOAL_BY_INDUSTRY, MOCK_AUDIT_FINDINGS } from "@/data/mockAuditFindings";
import { GOALS } from "@/data/goals";
import { INDUSTRIES } from "@/data/industries";
import { VISUAL_STYLES } from "@/data/visualStyles";
import { STRINGS } from "@/i18n/strings";
import type {
  CountryId,
  GoalId,
  IndustryId,
  Language,
  Platform,
  VisualStyle,
} from "@/types/domain";

/**
 * The one place the prompt engine reads localized values out of the data
 * layer. Every generator resolves its inputs through these helpers, so the
 * `INDUSTRIES[id].field[lang]` access pattern exists exactly once.
 */

export interface IndustryContext {
  label: string;
  trust: string;
  modernPattern: string;
}

export function resolveIndustry(
  id: IndustryId,
  lang: Language,
): IndustryContext {
  const ind = INDUSTRIES[id];
  return {
    label: ind.label[lang],
    trust: ind.trust[lang],
    modernPattern: ind.modernPattern[lang],
  };
}

export function resolveGoalDescription(id: GoalId, lang: Language): string {
  return GOALS[id].description[lang];
}

export function resolveStyleDirection(
  id: VisualStyle,
  lang: Language,
): string {
  return VISUAL_STYLES[id].direction[lang];
}

export function resolvePlatformLabel(
  platform: Platform,
  lang: Language,
): string {
  return STRINGS[lang].platformLabels[platform];
}

/** The sensible default conversion goal to assume for an industry. */
export function resolveDefaultGoal(industry: IndustryId): GoalId {
  return DEFAULT_GOAL_BY_INDUSTRY[industry];
}

/** The lead's market, as a display name (e.g. "Sweden") for research context. */
export function resolveCountryName(country: CountryId): string {
  return COUNTRIES_MAP[country]?.name ?? "Unknown";
}

/**
 * Sample "audit result" text for an industry — stands in for the real
 * ChatGPT reply when generating from a lead with no pasted-in audit yet.
 * See `data/mockAuditFindings.ts` for why this exists.
 */
export function resolveMockAuditFinding(
  industry: IndustryId,
  lang: Language,
): string {
  return MOCK_AUDIT_FINDINGS[industry][lang];
}
