import type { Language, MockupDevice, MockupScope } from "@/types/domain";

/**
 * Prompt templates for the mockup image generator — verbatim wording from
 * the original HTML project. Holds ONLY the literal templates and the
 * device/scope phrasing; data resolution and language selection live in
 * `mockupPrompt.ts`. Do not edit the wording — output must stay identical.
 */

export const DEVICE_TEXT: Record<Language, Record<MockupDevice, string>> = {
  cs: {
    both: "Ukaž vedle sebe v JEDNOM obrázku desktopovou verzi (široký prohlížeč, 1440px) vlevo a mobilní verzi (telefon, 390px) vpravo.",
    desktop:
      "Ukaž pouze desktopovou verzi (široký prohlížeč, 1440px) v realistickém rámu prohlížeče.",
    tablet:
      "Ukaž pouze tabletovou verzi (na výšku, ~810px) v realistickém rámu tabletu.",
    mobile:
      "Ukaž pouze mobilní verzi (telefon, 390px) v realistickém rámu telefonu.",
  },
  en: {
    both: "Show side by side in ONE image — the desktop version (wide browser, 1440px) on the left and the mobile version (phone, 390px) on the right.",
    desktop:
      "Show the desktop version only (wide browser, 1440px) inside a realistic browser frame.",
    tablet:
      "Show the tablet version only (portrait, ~810px) inside a realistic tablet frame.",
    mobile:
      "Show the mobile version only (phone, 390px) inside a realistic phone frame.",
  },
};

export const SCOPE_TEXT: Record<Language, Record<MockupScope, string>> = {
  cs: {
    full: "kompletní moderní homepage (full-page návrh shora dolů s několika sekcemi)",
    hero: "pouze hero sekci / první obrazovku (above the fold)",
    section: "konkrétní sekci, která řeší níže popsaný problém",
  },
  en: {
    full: "a complete modern homepage (full-page top-to-bottom design with several sections)",
    hero: "the hero section / first screen only (above the fold)",
    section: "the specific section that addresses the problem described below",
  },
};

export interface MockupTemplateVars {
  indLabel: string;
  scopeText: string;
  deviceText: string;
  problem: string;
  fix: string;
  patterns: string;
  styleText: string;
}

/** Czech mockup image prompt. */
export function buildMockupPromptCs({
  indLabel,
  scopeText,
  deviceText,
  problem,
  fix,
  patterns,
  styleText,
}: MockupTemplateVars): string {
  return `Vygeneruj obrázek (image) — fotorealistický mockup moderního redesignu webové stránky.

OBOR: ${indLabel}
CO ZOBRAZIT: ${scopeText}
ZAŘÍZENÍ: ${deviceText}

PROBLÉM, KTERÝ MUSÍ NÁVRH VYŘEŠIT:
${problem}${fix ? `\n\nSMĚR ŘEŠENÍ: ${fix}` : ""}

MODERNÍ UX VZORY PRO TENTO OBOR (zapracuj je):
${patterns}

VIZUÁLNÍ STYL — DODRŽ PŘESNĚ TENTO SMĚR:
${styleText}

DŮLEŽITÉ POKYNY K LAYOUTU:
- Mezi sekcemi nech VÝRAZNĚ víc bílého místa (whitespace). Sekce nesmí být namačkané na sebe — dej jim prostor dýchat, velkorysý vertikální padding.
- Jasná vizuální hierarchie, čitelná moderní typografie.
- Realistický obsah (žádný lorem ipsum, žádné rozbité texty) — použij věrohodné nadpisy a popisky relevantní pro tento obor.
- Profesionální, důvěryhodný dojem. Reálná fotografie místo placeholderů.
- Jeden jasný hlavní CTA, vizuálně odlišený.

Výstup: jeden čistý, ostrý mockup obrázek připravený k prezentaci klientovi.`;
}

/** English mockup image prompt. */
export function buildMockupPromptEn({
  indLabel,
  scopeText,
  deviceText,
  problem,
  fix,
  patterns,
  styleText,
}: MockupTemplateVars): string {
  return `Create an image — a photorealistic mockup of a modern website redesign.

INDUSTRY: ${indLabel}
WHAT TO SHOW: ${scopeText}
DEVICES: ${deviceText}

PROBLEM THE DESIGN MUST SOLVE:
${problem}${fix ? `\n\nFIX DIRECTION: ${fix}` : ""}

MODERN UX PATTERNS FOR THIS INDUSTRY (incorporate them):
${patterns}

VISUAL STYLE — FOLLOW THIS DIRECTION EXACTLY:
${styleText}

IMPORTANT LAYOUT INSTRUCTIONS:
- Use SIGNIFICANTLY more whitespace between sections. Sections must not be cramped together — give them room to breathe, with generous vertical padding.
- Clear visual hierarchy, readable modern typography.
- Realistic content (no lorem ipsum, no broken text) — use believable headlines and copy relevant to this industry.
- Professional, trustworthy feel. Real photography instead of placeholders.
- One clear primary CTA, visually distinct.

Output: a single clean, sharp mockup image ready to present to a client.`;
}
