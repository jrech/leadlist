import {
  buildEmailVariantsCs,
  buildEmailVariantsEn,
} from "@/lib/prompt-engine/email.templates";
import { pickByLang } from "@/lib/prompt-engine/localize";
import { parseAudit } from "@/lib/prompt-engine/parseAudit";
import type { Channel, Language } from "@/types/domain";

export interface EmailVariantInput {
  /** Raw audit text pasted from ChatGPT. */
  rawAudit: string;
  company: string;
  contact: string;
  yourName: string;
  channel: Channel;
  lang: Language;
}

export interface EmailVariant {
  subject: string;
  body: string;
  /** Channel-ready text: subject + body for email, body only for LinkedIn. */
  copyText: string;
}

/** Strips the sign-off blank line for LinkedIn DMs. */
const SIGN_OFF_RE = /\n\n(Best,|Hezký den,|Best regards,)\n/;

/**
 * Parse the audit, resolve greeting/company/sign-off through the shared
 * language helper, build the three strategy variants from the templates,
 * then apply the channel transform. Pure — rendering lives in the UI.
 *
 * Low-level — takes the raw structured input directly. Most callers want
 * `generateEmailPrompt(lead)` from `./leads` instead.
 */
export function generateEmailVariantsFromInput(
  input: EmailVariantInput,
): EmailVariant[] {
  const { rawAudit, company, contact, yourName, channel, lang } = input;
  const a = parseAudit(rawAudit);

  const sign =
    yourName || pickByLang(lang, { cs: "[Tvé jméno]", en: "[Your name]" });
  const comp = company || pickByLang(lang, { cs: "váš web", en: "your website" });
  const greet = contact
    ? pickByLang(lang, { cs: `Ahoj ${contact},`, en: `Hi ${contact},` })
    : pickByLang(lang, { cs: "Dobrý den,", en: "Hi there," });

  const build = pickByLang(lang, {
    cs: buildEmailVariantsCs,
    en: buildEmailVariantsEn,
  });

  const raw = build({
    company,
    comp,
    greet,
    sign,
    problem: a.problem,
    impact: a.impact,
    fix: a.fix,
  });

  const isEmail = channel === "email";
  return raw.map(({ subject, body }) => {
    const finalBody = isEmail ? body : body.replace(SIGN_OFF_RE, "\n\n");
    return {
      subject,
      body: finalBody,
      copyText: isEmail ? `${subject}\n\n${finalBody}` : finalBody,
    };
  });
}
