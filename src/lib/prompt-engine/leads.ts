import {
  generateAuditPromptFromInput,
  type AuditPromptInput,
} from "@/lib/prompt-engine/audit";
import {
  resolveDefaultGoal,
  resolveMockAuditFinding,
} from "@/lib/prompt-engine/context";
import {
  generateEmailVariantsFromInput,
  type EmailVariant,
  type EmailVariantInput,
} from "@/lib/prompt-engine/email";
import {
  generateMockupPromptFromInput,
  type MockupPromptInput,
} from "@/lib/prompt-engine/mockup";
import {
  generateResearchPromptFromInput,
  type ResearchPromptInput,
} from "@/lib/prompt-engine/research";
import type { Language } from "@/types/domain";
import type { Lead } from "@/types/lead";

/**
 * Canonical, lead-first entry points to the prompt engine. This is what
 * every feature should call — `generateAuditPrompt(lead)`,
 * `generateMockupPrompt(lead)`, `generateEmailPrompt(lead)` — instead of
 * hand-assembling the structured input objects the lower-level
 * `*FromInput` builders take. All the "what does this lead need by
 * default" decisions (conversion goal per industry, the sample audit
 * finding standing in for a real pasted-in result, the sender sign-off)
 * live here, once, instead of being re-derived wherever a lead is at hand.
 */

/** Sign-off name used until the app has real user accounts. */
const DEFAULT_SENDER_NAME = "Jonas";

export interface LeadResearchPrompt {
  input: ResearchPromptInput;
  output: string;
}

export function generateResearchPrompt(
  lead: Lead,
  lang: Language = "cs",
): LeadResearchPrompt {
  const input: ResearchPromptInput = {
    company: lead.company,
    website: lead.website,
    industry: lead.industry,
    country: lead.country,
    lang,
  };
  return { input, output: generateResearchPromptFromInput(input) };
}

export interface LeadAuditPrompt {
  input: AuditPromptInput;
  output: string;
}

export function generateAuditPrompt(
  lead: Lead,
  lang: Language = "cs",
): LeadAuditPrompt {
  const input: AuditPromptInput = {
    industry: lead.industry,
    goal: resolveDefaultGoal(lead.industry),
    platform: "mobile",
    outputType: "single",
    lang,
  };
  return { input, output: generateAuditPromptFromInput(input) };
}

export interface LeadMockupPrompt {
  input: MockupPromptInput;
  prompt: string;
  problem: string;
}

export function generateMockupPrompt(
  lead: Lead,
  lang: Language = "cs",
): LeadMockupPrompt {
  const input: MockupPromptInput = {
    industry: lead.industry,
    rawProblem: resolveMockAuditFinding(lead.industry, lang),
    scope: "full",
    device: "both",
    style: "clean",
    lang,
  };
  const { prompt, problem } = generateMockupPromptFromInput(input);
  return { input, prompt, problem };
}

export interface LeadEmailPrompt {
  input: EmailVariantInput;
  variants: EmailVariant[];
}

export function generateEmailPrompt(
  lead: Lead,
  lang: Language = "cs",
): LeadEmailPrompt {
  const input: EmailVariantInput = {
    rawAudit: resolveMockAuditFinding(lead.industry, lang),
    company: lead.company,
    contact: lead.contact?.name ?? "",
    yourName: DEFAULT_SENDER_NAME,
    channel: "email",
    lang,
  };
  return { input, variants: generateEmailVariantsFromInput(input) };
}
