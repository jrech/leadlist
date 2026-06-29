import type { GoalId, Language, Localized } from "@/types/domain";

export interface Goal {
  id: GoalId;
  /** Short label for the select dropdown. */
  optionLabel: Localized;
  /** Descriptive phrase injected into prompts. */
  description: Localized;
}

/**
 * Conversion goals. Consolidates i18n.goals + goalData[/Cs] from the PoC.
 */
export const GOALS: Record<GoalId, Goal> = {
  call: {
    id: "call",
    optionLabel: { cs: "Telefonní poptávka", en: "Phone inquiry / call" },
    description: {
      cs: "telefonní poptávka (kliknutí na číslo / call button)",
      en: "phone inquiry (click-to-call / call button)",
    },
  },
  form: {
    id: "form",
    optionLabel: { cs: "Formulář / kontakt", en: "Contact form submission" },
    description: {
      cs: "vyplnění kontaktního formuláře",
      en: "contact form submission",
    },
  },
  booking: {
    id: "booking",
    optionLabel: { cs: "Online rezervace", en: "Online booking" },
    description: {
      cs: "dokončení online rezervace",
      en: "completing an online booking",
    },
  },
  purchase: {
    id: "purchase",
    optionLabel: { cs: "Přímý nákup", en: "Direct purchase" },
    description: {
      cs: "dokončení nákupu / přidání do košíku",
      en: "completing a purchase / add to cart",
    },
  },
  email: {
    id: "email",
    optionLabel: { cs: "Odběr newsletteru", en: "Newsletter signup" },
    description: {
      cs: "přihlášení k newsletteru / lead magnet",
      en: "newsletter signup / lead magnet",
    },
  },
};

export const GOAL_LIST: Goal[] = Object.values(GOALS);

/** Localized `{ value, label }` options for a select. */
export function getGoalOptions(lang: Language) {
  return GOAL_LIST.map((g) => ({ value: g.id, label: g.optionLabel[lang] }));
}
