/**
 * The lifecycle every AI module (Audit, Mockup, Email, and any future one)
 * goes through. Defined once here so it's a real shared contract, not a
 * convention re-invented per module.
 *
 *   idle → generating → generated → edited → saved
 *                  ↘                  ↑________|
 *                    failed   (edited/saved can both regenerate or re-edit)
 *
 * Not every module reaches every state — Mockup, for instance, has no
 * editable text, so it only ever moves between idle/generating/generated/
 * failed. That's fine: the state set is shared, using all of it isn't
 * required.
 */
export type GenerationStatus =
  | "idle"
  | "generating"
  | "generated"
  | "edited"
  | "saved"
  | "failed";

/** Which AI module a given piece of generation-state UI belongs to. */
export type GenerationModule = "audit" | "mockup" | "email";
