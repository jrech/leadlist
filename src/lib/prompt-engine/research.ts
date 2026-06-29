import {
  resolveCountryName,
  resolveIndustry,
} from "@/lib/prompt-engine/context";
import { pickByLang } from "@/lib/prompt-engine/localize";
import {
  buildResearchPromptCs,
  buildResearchPromptEn,
} from "@/lib/prompt-engine/research.templates";
import type { CountryId, IndustryId, Language } from "@/types/domain";

export interface ResearchPromptInput {
  company: string;
  website: string;
  industry: IndustryId;
  country: CountryId;
  lang: Language;
}

/**
 * Resolve the localized data the research prompt needs, then defer to the
 * language-specific template. Low-level — takes raw structured input; most
 * callers want `generateResearchPrompt(lead)` from `./leads`.
 */
export function generateResearchPromptFromInput(input: ResearchPromptInput): string {
  const { company, website, industry, country, lang } = input;
  const ind = resolveIndustry(industry, lang);
  const build = pickByLang(lang, {
    cs: buildResearchPromptCs,
    en: buildResearchPromptEn,
  });

  return build({
    company,
    website,
    indLabel: ind.label,
    trust: ind.trust,
    countryLabel: resolveCountryName(country),
  });
}
