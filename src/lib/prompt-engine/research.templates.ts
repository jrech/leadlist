/**
 * Prompt templates for the lead-research generator. The research prompt is the
 * first step of the workflow (New → Research): it turns a bare lead into a
 * concise outreach brief the designer can act on. Bilingual, mirroring the
 * audit/email templates; this file holds only the literal wording.
 */
export interface ResearchTemplateVars {
  company: string;
  website: string;
  indLabel: string;
  trust: string;
  countryLabel: string;
}

/** Czech research prompt. */
export function buildResearchPromptCs({
  company,
  website,
  indLabel,
  trust,
  countryLabel,
}: ResearchTemplateVars): string {
  return `Jsi výzkumný asistent pro freelance web designera, který dělá cold outreach.

Firma: ${company}
Web: ${website || "(zatím neznámý)"}
Obor: ${indLabel}
Trh: ${countryLabel}

ÚKOL: Připrav stručný research brief, který použiju k personalizaci cold outreach e-mailu a k UX auditu webu. Vycházej z veřejně dostupných informací; co nelze ověřit, označ jako odhad.

Vyplň přesně tyto sekce:

PŘEHLED FIRMY:
- Co firma dělá a komu, v 1–2 větách
- Velikost a působnost (lokální / regionální / online)

KONTAKTNÍ OSOBA:
- Kdo nejspíš rozhoduje o webu (jméno nebo role)
- Nejlepší kanál pro oslovení

PRAVDĚPODOBNÉ SLABINY:
- 2–3 konkrétní problémy webu nebo online přítomnosti, které snižují poptávky
- Pro tento obor sleduj zejména prvky důvěry: ${trust}

PERSONALIZAČNÍ HÁČKY:
- 2–3 konkrétní detaily (nedávná novinka, recenze, vizuál, lokalita), na které lze v e-mailu navázat

ÚHEL OSLOVENÍ:
- Jedna věta: nejsilnější důvod, proč by je redesign zajímal právě teď

Tón: stručný, věcný, akční. Tohle je interní brief, ne text pro klienta.`;
}

/** English research prompt. */
export function buildResearchPromptEn({
  company,
  website,
  indLabel,
  trust,
  countryLabel,
}: ResearchTemplateVars): string {
  return `You are a research assistant for a freelance web designer doing cold outreach.

Company: ${company}
Website: ${website || "(unknown for now)"}
Industry: ${indLabel}
Market: ${countryLabel}

TASK: Produce a concise research brief I can use to personalize a cold outreach email and a website audit. Work from publicly available information; flag anything you can't verify as an assumption.

Fill in exactly these sections:

BUSINESS SNAPSHOT:
- What the company does and for whom, in 1–2 sentences
- Size and reach (local / regional / online-only)

DECISION MAKER:
- Who most likely owns the website (a name or a role)
- Best channel to reach them

LIKELY PAIN POINTS:
- 2–3 concrete website or online-presence problems costing them leads
- For this industry, pay special attention to trust signals: ${trust}

PERSONALIZATION HOOKS:
- 2–3 specific details (a recent update, a review, a visual, the location) an email could reference

OUTREACH ANGLE:
- One sentence: the single strongest reason a redesign would matter to them right now

Tone: concise, factual, actionable. This is an internal brief, not client-facing copy.`;
}
