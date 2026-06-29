/**
 * Core domain vocabulary shared across data, generators, and UI.
 * These string-literal unions replace the loose string keys used in the
 * original PoC and give the prompt generators full type-safety.
 */

export type Language = "cs" | "en";

export type IndustryId =
  | "clinic"
  | "law"
  | "hotel"
  | "adventure"
  | "restaurant"
  | "ecommerce"
  | "saas"
  | "freelancer"
  | "generic";

export type GoalId = "call" | "form" | "booking" | "purchase" | "email";

/** Countries the outreach pipeline currently tracks leads in — matches the Notion `Country` select exactly. */
export type CountryId = "czech_republic" | "sweden" | "norway" | "denmark" | "finland" | "other";

/** Step 1 — audit prompt scope. */
export type Platform = "mobile" | "desktop" | "both";
export type AuditOutputType = "single" | "full";

/** Step 2 — outreach message channel. */
export type Channel = "email" | "linkedin";

/** Step 3 — mockup image prompt. */
export type MockupScope = "full" | "hero" | "section";
export type MockupDevice = "both" | "desktop" | "tablet" | "mobile";
export type VisualStyle = "clean" | "premium" | "bold";

/** A value that has both Czech and English variants. */
export type Localized<T = string> = Record<Language, T>;
