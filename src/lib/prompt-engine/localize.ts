import type { Language, Localized } from "@/types/domain";

/**
 * The single language-dispatch primitive for the prompt engine. Works for
 * any value that has a `{ cs, en }` shape — a localized string OR a
 * language-specific builder function. Replaces the `lang === "cs" ? … : …`
 * ternaries that were duplicated across every generator.
 */
export function pickByLang<T>(lang: Language, variants: Localized<T>): T {
  return variants[lang];
}
