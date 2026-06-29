import type { GoalId, IndustryId, Localized } from "@/types/domain";

/**
 * Stand-in for "what ChatGPT would have said" when a lead has no real audit
 * result yet. The real workflow is: generate the audit prompt → paste it
 * into ChatGPT → paste the reply back in. Since this app makes no AI calls,
 * the Mockup and Email cards need *something* shaped like that reply to
 * parse — these fixtures fill that gap, in the exact `PROBLEM: / BUSINESS
 * IMPACT: / QUICK FIX:` format `parseAudit` expects, so the real templates
 * run unmodified. Labelled "sample" in the UI — never presented as real AI
 * output.
 */
export const MOCK_AUDIT_FINDINGS: Record<IndustryId, Localized> = {
  clinic: {
    cs: `PLATFORMA: mobil
PROBLÉM: Online rezervační widget je až na konci stránky, pod třemi sekcemi textu o klinice.
BYZNYSOVÝ DOPAD: Pacienti na mobilu nedojdou ke kontaktu a odcházejí na konkurenční web s viditelnější rezervací.
RYCHLÉ ŘEŠENÍ: Přesunout tlačítko "Objednat se" do horní lišty jako sticky CTA, viditelné na celé stránce.`,
    en: `PLATFORM: mobile
PROBLEM: The online booking widget sits at the very bottom of the page, below three sections of clinic copy.
BUSINESS IMPACT: Mobile patients give up before reaching it and book with a competitor whose booking button is visible immediately.
QUICK FIX: Move the "Book appointment" action into a sticky header CTA visible on every scroll position.`,
  },
  law: {
    cs: `PLATFORMA: desktop
PROBLÉM: Hlavička neobsahuje žádný kontakt ani CTA — návštěvník musí scrollovat přes celý hero, aby našel telefon.
BYZNYSOVÝ DOPAD: Lidé hledající rychlou konzultaci odcházejí, protože nenajdou způsob, jak se rychle ozvat.
RYCHLÉ ŘEŠENÍ: Doplnit do hlavičky telefonní číslo a tlačítko "Nezávazná konzultace".`,
    en: `PLATFORM: desktop
PROBLEM: The header has no contact info or CTA — visitors must scroll past the entire hero to find a phone number.
BUSINESS IMPACT: People looking for a fast consultation leave without a clear way to reach out.
QUICK FIX: Add a phone number and a "Free consultation" button directly into the header.`,
  },
  hotel: {
    cs: `PLATFORMA: obojí
PROBLÉM: Rezervační formulář vyžaduje 9 polí a otevírá se až po kliknutí na vedlejší odkaz v patičce.
BYZNYSOVÝ DOPAD: Vysoký počet opuštěných rezervací, hosté odcházejí na rezervační portály s jednodušším flow.
RYCHLÉ ŘEŠENÍ: Přidat sticky rezervační lištu s výběrem dat hned pod hero sekcí a zkrátit formulář na 4 pole.`,
    en: `PLATFORM: both
PROBLEM: The booking form has 9 required fields and only opens from a small footer link.
BUSINESS IMPACT: High booking abandonment — guests leave for OTA sites with a simpler flow.
QUICK FIX: Add a sticky date-picker booking bar right under the hero and cut the form down to 4 fields.`,
  },
  adventure: {
    cs: `PLATFORMA: mobil
PROBLÉM: Ceny zážitků jsou viditelné až po otevření detailu, hlavní výpis ukazuje jen fotky bez cen ani délky.
BYZNYSOVÝ DOPAD: Návštěvníci nemají rychlé srovnání a opouštějí stránku dřív, než se dostanou k objednávce.
RYCHLÉ ŘEŠENÍ: Doplnit do karet zážitků cenu, délku a obtížnost přímo ve výpisu.`,
    en: `PLATFORM: mobile
PROBLEM: Trip pricing only appears after opening a detail page — the main listing shows photos with no price or duration.
BUSINESS IMPACT: Visitors can't compare options quickly and bounce before reaching a booking decision.
QUICK FIX: Show price, duration, and difficulty directly on each experience card in the listing.`,
  },
  restaurant: {
    cs: `PLATFORMA: mobil
PROBLÉM: Otevírací doba je schovaná v patičce malým písmem, na hero sekci o ní nic není.
BYZNYSOVÝ DOPAD: Hosté nevědí, jestli je otevřeno, a raději zavolají konkurenci, kde to vidí hned.
RYCHLÉ ŘEŠENÍ: Zobrazit aktuální otevírací stav ("Otevřeno do 22:00") jako badge hned v hero sekci.`,
    en: `PLATFORM: mobile
PROBLEM: Opening hours are buried in small footer text — nothing about them appears in the hero.
BUSINESS IMPACT: Guests aren't sure if the restaurant is open and call a competitor who shows it upfront.
QUICK FIX: Show a live status badge ("Open until 10pm") right in the hero section.`,
  },
  ecommerce: {
    cs: `PLATFORMA: obojí
PROBLÉM: Tlačítko "Přidat do košíku" je stejnou barvou jako pozadí a splývá s ostatními prvky stránky.
BYZNYSOVÝ DOPAD: Nízká míra prokliku na produktových stránkách, nakupující si tlačítko jednoduše nevšimnou.
RYCHLÉ ŘEŠENÍ: Použít sytou kontrastní barvu pro primární CTA a zvětšit tlačítko o 20 %.`,
    en: `PLATFORM: both
PROBLEM: The "Add to cart" button is nearly the same color as the background and blends into the rest of the page.
BUSINESS IMPACT: Low click-through on product pages — shoppers simply don't notice the button.
QUICK FIX: Use a strong contrasting color for the primary CTA and increase its size by ~20%.`,
  },
  saas: {
    cs: `PLATFORMA: desktop
PROBLÉM: Hero sekce popisuje funkce technickým jazykem bez konkrétního screenshotu produktu.
BYZNYSOVÝ DOPAD: Návštěvníci si nedokážou rychle představit produkt a odcházejí bez založení trial účtu.
RYCHLÉ ŘEŠENÍ: Nahradit text v hero sekci reálným screenshotem nebo krátkým produktovým GIFem.`,
    en: `PLATFORM: desktop
PROBLEM: The hero describes features in technical language with no real product screenshot.
BUSINESS IMPACT: Visitors can't quickly picture the product and leave without starting a trial.
QUICK FIX: Replace the hero copy block with a real product screenshot or a short product GIF.`,
  },
  freelancer: {
    cs: `PLATFORMA: mobil
PROBLÉM: Portfolio ukazuje jen názvy projektů bez náhledů nebo výsledků, ke kterým vedly.
BYZNYSOVÝ DOPAD: Potenciální klienti nevidí kvalitu práce a nemají důvod věřit, že dodáte výsledek.
RYCHLÉ ŘEŠENÍ: Doplnit ke každému projektu náhledový obrázek a jednu konkrétní metriku výsledku.`,
    en: `PLATFORM: mobile
PROBLEM: The portfolio lists project names only — no preview images or the results they led to.
BUSINESS IMPACT: Prospective clients can't gauge work quality and have no reason to trust the outcome.
QUICK FIX: Add a preview image and one concrete result metric to each portfolio entry.`,
  },
  generic: {
    cs: `PLATFORMA: mobil
PROBLÉM: Hlavní CTA tlačítko je na mobilu schované až pod třemi sekcemi textu.
BYZNYSOVÝ DOPAD: Návštěvníci na mobilu odcházejí dřív, než se dostanou k akci, a firma ztrácí poptávky.
RYCHLÉ ŘEŠENÍ: Přesunout hlavní CTA do hero sekce a zopakovat ho i na konci stránky.`,
    en: `PLATFORM: mobile
PROBLEM: The primary CTA is hidden below three sections of text on mobile.
BUSINESS IMPACT: Mobile visitors leave before reaching the action, and the business loses inquiries.
QUICK FIX: Move the primary CTA into the hero section and repeat it again at the end of the page.`,
  },
};

/** A sensible default conversion goal per industry, for mock generation inputs. */
export const DEFAULT_GOAL_BY_INDUSTRY: Record<IndustryId, GoalId> = {
  clinic: "call",
  law: "form",
  hotel: "booking",
  adventure: "booking",
  restaurant: "booking",
  ecommerce: "purchase",
  saas: "email",
  freelancer: "form",
  generic: "form",
};
