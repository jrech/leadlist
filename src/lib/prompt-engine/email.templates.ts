/**
 * Email/LinkedIn outreach message templates — verbatim wording from the
 * original HTML project. Holds ONLY the literal message text for the three
 * strategies (Direct / Soft / Value-first). Parsing, greeting/sign-off
 * resolution, and channel transforms live in `emailVariants.ts`.
 * Do not edit the wording — outputs must stay identical.
 */

export interface EmailTemplateVars {
  /** Company as typed (may be empty — templates handle fallbacks). */
  company: string;
  /** Company reference with fallback ("your website" / "váš web"). */
  comp: string;
  /** Greeting line, e.g. "Hi Jan," / "Dobrý den,". */
  greet: string;
  /** Sign-off name with fallback. */
  sign: string;
  /** Parsed audit fields. */
  problem: string;
  impact: string;
  fix: string;
}

export interface RawVariant {
  subject: string;
  body: string;
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Czech variants: Direct, Soft, Value-first. */
export function buildEmailVariantsCs({
  company,
  comp,
  greet,
  sign,
  problem,
  impact,
  fix,
}: EmailTemplateVars): RawVariant[] {
  return [
    {
      subject: `${company || "Váš web"} — jedna věc, co vás možná stojí zákazníky`,
      body: `${greet}

koukal jsem na ${comp} a všiml jsem si jedné konkrétní věci:

${problem}${impact ? `\n\n${impact}` : ""}

${fix ? `Rychlé řešení: ${fix}` : ""}

Mám pár dalších nápadů, jak to vyladit. Hodí se vám 15 minut tento týden?

${sign}`,
    },
    {
      subject: `Rychlý postřeh k webu ${company || ""}`.trim(),
      body: `${greet}

nechci otravovat — jen mě při procházení ${comp} zaujala jedna drobnost, která by mohla pomoct s konverzemi:

${problem}

${fix ? `Dalo by se to vyřešit celkem snadno — ${lowerFirst(fix)}` : ""}

Kdyby vás zajímalo víc, rád pošlu pár konkrétních tipů. Žádný tlak.

Hezký den,
${sign}`,
    },
    {
      subject: `Pár nápadů na web ${company || "vaší firmy"}`,
      body: `${greet}

věnuju se webdesignu a optimalizaci konverzí, a když jsem narazil na ${comp}, hned mi padlo do oka tohle:

${problem}${impact ? `\n\nProč to řeším: ${impact}` : ""}

${fix ? `Konkrétně bych zkusil: ${fix}` : ""}

Tohle je jen jedna věc z několika, co jsem si všiml. Kdyby dávalo smysl projít to spolu, ozvěte se — klidně nezávazně.

${sign}`,
    },
  ];
}

/** English variants: Direct, Soft, Value-first. */
export function buildEmailVariantsEn({
  company,
  comp,
  greet,
  sign,
  problem,
  impact,
  fix,
}: EmailTemplateVars): RawVariant[] {
  return [
    {
      subject: `${company || "Your website"} — one thing that might be costing you customers`,
      body: `${greet}

I took a look at ${comp} and noticed one specific thing:

${problem}${impact ? `\n\n${impact}` : ""}

${fix ? `Quick fix: ${fix}` : ""}

I've got a few more ideas on how to tighten this up. Do you have 15 minutes this week?

${sign}`,
    },
    {
      subject: `Quick note about ${company || "your site"}`.trim(),
      body: `${greet}

I don't want to clutter your inbox — but while browsing ${comp}, one small thing caught my eye that could help your conversions:

${problem}

${fix ? `It'd be a fairly easy fix — ${lowerFirst(fix)}` : ""}

If you'd like, I'm happy to send a few concrete tips. No pressure either way.

Best,
${sign}`,
    },
    {
      subject: `A few ideas for ${company || "your"} website`,
      body: `${greet}

I work in web design and conversion optimization, and when I came across ${comp}, this jumped out at me right away:

${problem}${impact ? `\n\nWhy it matters: ${impact}` : ""}

${fix ? `Specifically, I'd try: ${fix}` : ""}

This is just one of a few things I spotted. If it'd make sense to walk through it together, just reply — no obligation.

${sign}`,
    },
  ];
}
