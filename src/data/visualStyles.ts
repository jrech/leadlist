import type { Localized, VisualStyle } from "@/types/domain";

export interface VisualStyleOption {
  id: VisualStyle;
  /** Short label for the pill / select. */
  optionLabel: Localized;
  /** Full style-direction block injected into the mockup image prompt. */
  direction: Localized;
}

/**
 * Mockup visual directions. Normalizes the original `styleDir` (which nested
 * {en, cs} inside each entry) onto the shared Localized shape.
 */
export const VISUAL_STYLES: Record<VisualStyle, VisualStyleOption> = {
  clean: {
    id: "clean",
    optionLabel: { cs: "Clean / minimal", en: "Clean / minimal" },
    direction: {
      en: `CLEAN / MINIMAL — in the spirit of Linear, Stripe, and Vercel.
- Palette: near-white or pure white background (#FFFFFF / #FAFAFA), near-black text (#0A0A0A), exactly ONE restrained accent color (a calm blue, indigo, or soft violet) used sparingly only on CTAs and links. No gradients except a single very subtle one if any.
- Typography: one crisp geometric/grotesque sans-serif (Inter, Geist, or similar) for everything. Tight, confident headline weight (medium/semibold, NOT black). Small uppercase eyebrow labels with letter-spacing. Generous line-height in body.
- Layout: strict grid, lots of negative space, thin 1px hairline dividers, small border-radius (8-12px), barely-there shadows. Restraint everywhere — nothing decorative. Functional, engineered, precise.
- Feel: calm, modern, trustworthy SaaS. The design gets out of the way of the content.`,
      cs: `CLEAN / MINIMAL — v duchu Linear, Stripe a Vercel.
- Paleta: skoro bílé nebo čistě bílé pozadí (#FFFFFF / #FAFAFA), skoro černý text (#0A0A0A), přesně JEDNA střídmá akcentní barva (klidná modrá, indigo nebo jemná fialová) použitá úsporně jen na CTA a odkazy. Žádné gradienty, maximálně jeden velmi jemný.
- Typografie: jedno ostré geometrické/groteskní bezpatkové písmo (Inter, Geist apod.) na všechno. Sebevědomá ale ne přehnaná váha nadpisů (medium/semibold, NE black). Malé verzálkové eyebrow labely s prostrkáním. Velkorysá výška řádku v textu.
- Layout: striktní grid, hodně negativního prostoru, tenké 1px linky, malý radius (8-12px), sotva viditelné stíny. Střídmost všude, nic dekorativního. Funkční, inženýrské, precizní.
- Pocit: klidný, moderní, důvěryhodný SaaS. Design ustupuje obsahu.`,
    },
  },
  premium: {
    id: "premium",
    optionLabel: { cs: "Premium", en: "Premium" },
    direction: {
      en: `PREMIUM / EDITORIAL — in the spirit of Aesop, Apple, and high-end hospitality brands.
- Palette: warm sophisticated neutrals — cream, bone, taupe, soft charcoal (#1A1815). Muted and earthy, never bright. Color comes from photography, not UI. Optional single deep accent (forest, oxblood, navy).
- Typography: an elegant high-contrast SERIF for large headlines (think Canela, Freight, or a refined Didone) paired with a quiet sans-serif for body. Large, airy display type set at a slow, luxurious pace. This serif/sans pairing is the signature.
- Layout: VERY generous whitespace, oversized margins, asymmetric editorial grid, large full-bleed photography with lots of room around it. Almost no borders or shadows — separation comes from space alone. Slow, considered rhythm.
- Feel: calm luxury, craftsmanship, understated confidence. Expensive without shouting. Like a printed magazine or a boutique hotel brochure.`,
      cs: `PREMIUM / EDITORIAL — v duchu Aesop, Apple a luxusních hotelových značek.
- Paleta: teplé sofistikované neutrály — krémová, kostěná, taupe, jemná uhlová (#1A1815). Tlumené a zemité, nikdy křiklavé. Barva přichází z fotografie, ne z UI. Volitelně jeden hluboký akcent (lesní zelená, oxblood, námořnická).
- Typografie: elegantní vysoce kontrastní PATKOVÉ písmo na velké nadpisy (Canela, Freight nebo rafinovaná Didona) v kombinaci s tichým bezpatkovým textem. Velká vzdušná display typografie nasazená pomalu a luxusně. Tahle kombinace patkové/bezpatkové je podpis.
- Layout: VELMI velkorysé bílé místo, předimenzované okraje, asymetrický editorial grid, velká celoplošná fotografie s prostorem kolem. Skoro žádné rámečky ani stíny — oddělení dělá jen prostor. Pomalý, promyšlený rytmus.
- Pocit: klidný luxus, řemeslo, nenápadné sebevědomí. Drahé bez křiku. Jako tištěný magazín nebo brožura butikového hotelu.`,
    },
  },
  bold: {
    id: "bold",
    optionLabel: { cs: "Bold", en: "Bold" },
    direction: {
      en: `BOLD / EXPRESSIVE — in the spirit of Gumroad, Figma, and modern DTC brands.
- Palette: confident and saturated — a strong primary color (electric blue, hot coral, acid green, or vivid purple) used as LARGE color blocks, not just accents. High contrast pairings, optionally a second clashing-but-intentional color. Colored section backgrounds, not just white.
- Typography: huge, heavy display headlines (extrabold/black weight) that dominate the hero and span multiple lines. Oversized type as a graphic element. Tight tracking on the big stuff. Playful but controlled.
- Layout: chunky rounded cards, thick borders or solid color blocks, visible structure, occasional slight rotation or offset for energy. Bigger buttons with strong fills. Still uses whitespace between sections, but each section has personality and color.
- Feel: energetic, memorable, friendly, confident. A brand with a strong point of view that wants to be remembered, not a quiet utility.`,
      cs: `BOLD / EXPRESIVNÍ — v duchu Gumroad, Figma a moderních DTC značek.
- Paleta: sebevědomá a sytá — silná primární barva (elektrická modrá, hot coral, acid green nebo živá fialová) použitá jako VELKÉ barevné bloky, ne jen akcenty. Vysoce kontrastní kombinace, volitelně druhá záměrně "kolidující" barva. Barevná pozadí sekcí, ne jen bílá.
- Typografie: obrovské těžké display nadpisy (extrabold/black) které ovládnou hero a táhnou se přes víc řádků. Předimenzované písmo jako grafický prvek. Těsné prostrkání u velkých nápisů. Hravé, ale pod kontrolou.
- Layout: bytelné zaoblené karty, silné rámečky nebo plné barevné bloky, viditelná struktura, občas mírné natočení nebo offset pro energii. Větší tlačítka s výraznou výplní. Pořád používá bílé místo mezi sekcemi, ale každá sekce má osobnost a barvu.
- Pocit: energický, zapamatovatelný, přátelský, sebevědomý. Značka se silným názorem, která chce být zapamatována, ne tichá utilita.`,
    },
  },
};

export const VISUAL_STYLE_LIST: VisualStyleOption[] =
  Object.values(VISUAL_STYLES);
