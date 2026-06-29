import type { IndustryId, Language, Localized } from "@/types/domain";

export interface Industry {
  id: IndustryId;
  /** Short label shown in the select dropdown. */
  optionLabel: Localized;
  /** Descriptive label injected into prompts ("clinic / healthcare provider"). */
  label: Localized;
  /** Industry-specific trust signals. */
  trust: Localized;
  /** Modern UX patterns to incorporate into a redesign mockup. */
  modernPattern: Localized;
}

/**
 * Single source of truth for industries. Consolidates the four parallel
 * objects from the original PoC (i18n.industries, industryData[/Cs],
 * modernPatterns[/Cs]) into one localized record.
 */
export const INDUSTRIES: Record<IndustryId, Industry> = {
  clinic: {
    id: "clinic",
    optionLabel: {
      cs: "Klinika / zdravotnictví",
      en: "Clinic / healthcare",
    },
    label: {
      cs: "klinika / zdravotnické zařízení",
      en: "clinic / healthcare provider",
    },
    trust: {
      cs: "certifikáty, fotky týmu, reference pacientů",
      en: "certificates, team photos, patient testimonials",
    },
    modernPattern: {
      cs: 'online rezervační widget vysoko na stránce, odznaky důvěry a certifikace, profilové karty lékařů s reálnými fotkami, přehledně kategorizované služby, sticky CTA „objednat se"',
      en: 'an online appointment booking widget high on the page, trust badges and certifications, doctor profile cards with real photos, clearly categorized services, a sticky "book appointment" CTA',
    },
  },
  law: {
    id: "law",
    optionLabel: {
      cs: "Advokát / právní služby",
      en: "Law firm / legal services",
    },
    label: {
      cs: "advokátní kancelář / právní služby",
      en: "law firm / legal services",
    },
    trust: {
      cs: "vzdělání, zkušenosti, případové studie",
      en: "education, experience, case studies",
    },
    modernPattern: {
      cs: 'hero stavějící na autoritě (kredenciály a výsledky), pruh se statistikami (vyhrané kauzy, roky praxe), karty oblastí specializace, výrazné „nezávazná konzultace", profesionální ale vřelá fotografie',
      en: 'an authority-first hero stating credentials and results, a stats band (cases won, years of practice), practice-area cards, a prominent "free consultation" booking, warm but professional photography',
    },
  },
  hotel: {
    id: "hotel",
    optionLabel: {
      cs: "Hotel / ubytování",
      en: "Hotel / accommodation",
    },
    label: {
      cs: "hotel / penzion / ubytování",
      en: "hotel / accommodation / guesthouse",
    },
    trust: {
      cs: "fotky interiéru, hodnocení hostů, lokace",
      en: "interior photos, guest reviews, location",
    },
    modernPattern: {
      cs: "celoplošná pohostinná imagery, sticky rezervační lišta s výběrem dat, karty pokojů s cenou a vybavením, zvýrazněné recenze hostů, sekce s lokalitou a okolím včetně mapy",
      en: "full-bleed hospitality imagery, a sticky booking bar with date picker, room cards with pricing and amenities, highlighted guest reviews, a location and surroundings section with a map",
    },
  },
  adventure: {
    id: "adventure",
    optionLabel: {
      cs: "Adventure / turistika",
      en: "Adventure / outdoor tourism",
    },
    label: {
      cs: "adventure turismus / outdoor aktivity",
      en: "adventure tourism / outdoor activities",
    },
    trust: {
      cs: "fotky z akcí, počet účastníků, bezpečnostní certifikáty",
      en: "action photos, participant count, safety certifications",
    },
    modernPattern: {
      cs: "immersivní celoobrazovkové hero foto/video, karty zážitků s obtížností/délkou/cenou, autentické fotky z reálných výletů jako social proof, jemná urgence (omezená místa), jasný rezervační flow",
      en: "an immersive full-screen hero photo or video, experience cards showing difficulty/duration/price, authentic photos from real trips as social proof, subtle urgency (limited spots), a clear booking flow",
    },
  },
  restaurant: {
    id: "restaurant",
    optionLabel: {
      cs: "Restaurace / gastro",
      en: "Restaurant / food & beverage",
    },
    label: {
      cs: "restaurace / kavárna / gastronomie",
      en: "restaurant / café / food & beverage",
    },
    trust: {
      cs: "fotky jídla, recenze, otevírací doba",
      en: "food photos, reviews, opening hours",
    },
    modernPattern: {
      cs: "chuťově lákavý hero s food fotografií přes celou šířku, sticky tlačítko rezervace, výběr z menu s fotkami, jasně viditelná otevírací doba, fotky interiéru a atmosféry",
      en: "an appetizing full-width food photography hero, a sticky reservation button, menu highlights with photos, clearly visible opening hours, ambiance and interior photos",
    },
  },
  ecommerce: {
    id: "ecommerce",
    optionLabel: {
      cs: "E-shop",
      en: "E-commerce / online store",
    },
    label: {
      cs: "e-shop / online prodej",
      en: "e-commerce / online store",
    },
    trust: {
      cs: "recenze produktů, doprava zdarma, vrácení zboží",
      en: "product reviews, free shipping, return policy",
    },
    modernPattern: {
      cs: "hero stavějící na produktu, čistý responzivní grid produktů, viditelné prvky důvěry (hodnocení, doprava zdarma, snadné vrácení), sticky přidání do košíku, košík s nízkým třením",
      en: "a product-forward hero, a clean responsive product grid, visible trust signals (ratings, free shipping, easy returns), a sticky add-to-cart, and a low-friction path to checkout",
    },
  },
  saas: {
    id: "saas",
    optionLabel: {
      cs: "SaaS / software",
      en: "SaaS / software product",
    },
    label: {
      cs: "SaaS / software produkt",
      en: "SaaS / software product",
    },
    trust: {
      cs: "počet uživatelů, loga firem, případové studie",
      en: "user count, company logos, case studies",
    },
    modernPattern: {
      cs: 'hero s jasnou hodnotovou nabídkou a reálným screenshotem produktu, karty benefitů, pruh log zákazníků, transparentní ceny, jedno silné CTA „vyzkoušet zdarma"',
      en: 'a clear value-proposition hero with a real product screenshot or UI preview, benefit-focused feature cards, a social-proof logo strip, transparent pricing, and a single strong "start free trial" CTA',
    },
  },
  freelancer: {
    id: "freelancer",
    optionLabel: {
      cs: "Freelancer / konzultant",
      en: "Freelancer / consultant / agency",
    },
    label: {
      cs: "freelancer / konzultant / agentura",
      en: "freelancer / consultant / agency",
    },
    trust: {
      cs: "portfolio, reference klientů, proces práce",
      en: "portfolio, client testimonials, process",
    },
    modernPattern: {
      cs: "hero stavějící na portfoliu, case-study karty vedoucí výsledky klientů, jednoduchá sekce s procesem o 3-4 krocích, zvýrazněné reference, jedno nepřehlédnutelné hlavní CTA",
      en: "a portfolio-forward hero, case-study cards that lead with client results, a simple 3-4 step process section, highlighted testimonials, and one unmistakable primary CTA",
    },
  },
  generic: {
    id: "generic",
    optionLabel: {
      cs: "Obecné SMB",
      en: "General SMB",
    },
    label: {
      cs: "lokální firma / SMB",
      en: "local business / SMB",
    },
    trust: {
      cs: "roky zkušeností, reference, certifikace",
      en: "years of experience, testimonials, certifications",
    },
    modernPattern: {
      cs: "hero s jasnou hodnotovou nabídkou, výrazné prvky důvěry, čisté karty služeb nebo produktů, jedno hlavní CTA strategicky opakované, moderní nepřeplácaný layout",
      en: "a clear value-proposition hero, prominent trust signals, clean service or product cards, a single primary CTA repeated strategically, and a modern uncluttered layout",
    },
  },
};

/** Ordered list for rendering selects (preserves the original ordering). */
export const INDUSTRY_LIST: Industry[] = Object.values(INDUSTRIES);

/** Localized `{ value, label }` options for a select. */
export function getIndustryOptions(lang: Language) {
  return INDUSTRY_LIST.map((i) => ({ value: i.id, label: i.optionLabel[lang] }));
}
