/**
 * Prompt engine — the single entry point for all prompt generation. The UI
 * never builds a prompt itself; it always calls in here.
 *
 * Primary API — what features should call:
 *   leads.ts             generateAuditPrompt(lead) / generateMockupPrompt(lead)
 *                         / generateEmailPrompt(lead) — resolves all the
 *                         lead-specific defaults (goal, sample finding,
 *                         sign-off) and calls the builders below.
 *
 * Lower-level API — for raw structured input (the standalone generator
 * pages, which collect form fields rather than holding a Lead):
 *   audit.ts / mockup.ts / email.ts   generate*FromInput(input)
 *   *.templates.ts                    verbatim prompt wording
 *
 * Shared layers:
 *   localize.ts          language dispatch (pickByLang)
 *   context.ts           the only place data is read out of the data layer
 *                         (industries, goals, styles, mock audit findings,
 *                         translations) — see @/data and @/i18n for the
 *                         datasets themselves
 *   parseAudit.ts        ChatGPT-output parsing
 *   promptStats.ts       word/char counting helper
 */
export * from "./localize";
export * from "./context";
export * from "./parseAudit";
export * from "./promptStats";
export * from "./research";
export * from "./audit";
export * from "./mockup";
export * from "./email";
export * from "./leads";
