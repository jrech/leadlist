import type { AuditOutputType, Platform } from "@/types/domain";

/**
 * Prompt templates for the audit generator — the verbatim prompt text from
 * the original HTML project. This file holds ONLY the literal templates;
 * resolving data (industry/goal/platform labels) and language selection
 * live in `auditPrompt.ts`. Do not edit the prompt wording — output must
 * stay byte-identical to the PoC.
 */
export interface AuditTemplateVars {
  indLabel: string;
  trust: string;
  goalLabel: string;
  platLabel: string;
  platform: Platform;
  outputType: AuditOutputType;
}

/** Czech audit prompt (single-issue + full audit). */
export function buildAuditPromptCs({
  indLabel,
  trust,
  goalLabel,
  platLabel,
  platform,
  outputType,
}: AuditTemplateVars): string {
  if (outputType === "single") {
    const pc =
      platform === "both"
        ? "Analyzuj OBĚ verze — mobilní (390px) i desktopovou (1440px). Tu, kterou nevidíš na screenshotu, si domysli."
        : platform === "mobile"
          ? "Zaměř se na mobilní verzi — simuluj obrazovku širokou 390px."
          : "Zaměř se na desktopovou verzi — simuluj viewport široký 1440px.";
    return `Jsi expert na UX a optimalizaci konverzí (CRO).

V příloze je screenshot webové stránky.
Typ podnikání: ${indLabel}
Hlavní konverzní cíl: ${goalLabel}
Platforma: ${platLabel}

${pc}

ÚKOL: Najdi přesně JEDEN kritický UX problém, který nejspíš právě teď nejvíc snižuje konverze.

Pravidla:
- Pouze JEDEN problém — ten s největším dopadem
- Buď konkrétní: ne „špatné CTA", ale „hlavní CTA tlačítko je na mobilu schované až pod třemi sekcemi textu"
- Vysvětli byznysový dopad v 1–2 větách (ztracené poptávky, ztráta důvěry, vysoký bounce)
- Navrhni konkrétní řešení ve 2–3 větách
- Relevantní prvky důvěry pro tento obor: ${trust}

Formát výstupu (dodrž přesně):
PLATFORMA: [mobil / desktop / obojí]
PROBLÉM: [jedna jasná věta]
BYZNYSOVÝ DOPAD: [1–2 věty]
RYCHLÉ ŘEŠENÍ: [2–3 věty]

Tón: přímý, profesionální, bez lakování na růžovo.
Piš jako senior designer, který brífuje klienta — ne jako obchoďák.`;
  }

  const mb = `
── MOBILNÍ AUDIT (390px) ──────────────────────────────

1. Above the fold (první obrazovka)
   · Je hodnotová nabídka jasná do 3 sekund?
   · Je hlavní CTA vidět bez scrollování?
   · Překážky? (předimenzovaný hero, cookie lišty, autoplay)

2. Design CTA
   · Mají tlačítka výšku ≥44px pro ovládání palcem?
   · Jsou hlavní a vedlejší akce vizuálně odlišené?
   · Konkurují si CTA navzájem a tříští pozornost?

3. Prvky důvěry
   · ${trust}
   · Objevují se před nebo až za CTA?

4. Konverzní cesta
   · Kolik kroků k cíli: ${goalLabel}?
   · Zbytečná pole ve formuláři nebo kroky navíc?
   · Je k dispozici záložní kontakt (např. telefon)?

5. Technické varovné signály
   · Známky pomalého načítání (velké neoptimalizované obrázky, těžké skripty)?
   · Známky nerespozivního layoutu (horizontální scroll, malé písmo)?`;

  const db = `
── DESKTOPOVÝ AUDIT (1440px) ──────────────────────────

1. Hero a první obrazovka
   · Sděluje headline hodnotu okamžitě?
   · Je CTA vidět bez scrollování na obrazovce vysoké 1080px?
   · Vede vizuální hierarchie oko směrem k CTA?

2. Layout a bílé místo
   · Je šířka obsahu optimální (≤1200px)? Nebo je roztažený moc?
   · Dost bílého místa mezi sekcemi?
   · Respektuje čtecí tok do F nebo Z?

3. Navigace
   · Je hlavní navigace přehledná a nepřeplácaná?
   · Je v hlavičce vidět CTA nebo klíčový kontakt?
   · Sticky navigace — je? Měla by být?

4. Důvěra a social proof
   · ${trust}
   · Je umístění logické v rámci scrollování?
   · Působí prvky důvěry věrohodně (reálné fotky vs stock)?

5. Konverzní cesta
   · Kolik kliknutí k cíli: ${goalLabel}?
   · Formuláře: přiměřená délka? Inline validace?
   · Vyskakovací okna nebo modály blokující cestu?`;

  const blocks =
    platform === "mobile" ? mb : platform === "desktop" ? db : `${mb}\n${db}`;

  return `Jsi senior UX auditor specializovaný na optimalizaci konverzí.

V příloze je screenshot webové stránky.
Typ podnikání: ${indLabel}
Hlavní konverzní cíl: ${goalLabel}
Rozsah platforem: ${platLabel}
Klíčové prvky důvěry pro tento obor: ${trust}
${blocks}

──────────────────────────────────────────────────────
Každou oblast výše ohodnoť:
  ✅ OK  /  ⚠️ KE ZLEPŠENÍ  /  🔴 KRITICKÉ

Pak uveď:

PRIORITNÍ OPRAVY (top 3, seřazené podle dopadu na konverze):
1. [Problém] → [Konkrétní řešení]
2. [Problém] → [Konkrétní řešení]
3. [Problém] → [Konkrétní řešení]

RYCHLÁ VÝHRA: Jedna změna realizovatelná do 1 hodiny.

Tón: přímý, akční. Tohle je interní brief, ne reportáž pro klienta.`;
}

/** English audit prompt (single-issue + full audit). */
export function buildAuditPromptEn({
  indLabel,
  trust,
  goalLabel,
  platLabel,
  platform,
  outputType,
}: AuditTemplateVars): string {
  if (outputType === "single") {
    const pc =
      platform === "both"
        ? "Analyze BOTH the mobile (390px) and desktop (1440px) experience. Simulate whichever view isn't shown."
        : platform === "mobile"
          ? "Focus on the mobile experience — simulate a 390px wide screen."
          : "Focus on the desktop experience — simulate a 1440px wide viewport.";
    return `You are a UX and conversion rate optimization expert.

Attached is a screenshot of a website.
Business type: ${indLabel}
Primary conversion goal: ${goalLabel}
Platform: ${platLabel}

${pc}

TASK: Identify exactly ONE critical UX issue most likely hurting their conversions right now.

Rules:
- ONE issue only — the single highest-impact problem
- Be specific: not "bad CTA" but "the primary CTA is hidden below three sections on mobile"
- Explain business impact in 1–2 sentences (lost leads, trust damage, high bounce)
- Suggest a concrete fix in 2–3 sentences
- Relevant trust signals for this industry: ${trust}

Output format (use exactly):
PLATFORM: [mobile / desktop / both]
PROBLEM: [one clear sentence]
BUSINESS IMPACT: [1–2 sentences]
QUICK FIX: [2–3 sentences]

Tone: direct, professional, no sugarcoating.
Write like a senior designer briefing a client — not a sales pitch.`;
  }

  const mb = `
── MOBILE AUDIT (390px) ──────────────────────────────

1. Above the fold
   · Value proposition clear within 3 seconds?
   · Primary CTA visible without scrolling?
   · Friction blockers? (oversized hero, cookie banners, autoplay)

2. CTA design
   · Buttons ≥44px height for thumb use?
   · Primary vs secondary actions visually distinct?
   · Competing CTAs diluting focus?

3. Trust signals
   · ${trust}
   · Do they appear before or after the CTA?

4. Conversion path
   · Steps to complete: ${goalLabel}?
   · Unnecessary form fields or steps?
   · Fallback contact option available (e.g. phone number)?

5. Technical red flags
   · Signs of slow load (large unoptimized images, heavy scripts)?
   · Non-responsive layout signs (horizontal scroll, tiny text)?`;

  const db = `
── DESKTOP AUDIT (1440px) ────────────────────────────

1. Hero & above the fold
   · Headline communicates value immediately?
   · CTA visible without scrolling on a 1080px height screen?
   · Visual hierarchy guides the eye toward the CTA?

2. Layout & whitespace
   · Content width optimal (≤1200px)? Or stretched too wide?
   · Sufficient whitespace between sections?
   · F-pattern / Z-pattern reading flow respected?

3. Navigation
   · Primary nav clear and uncluttered?
   · CTA or key contact visible in the header?
   · Sticky nav — present? Should it be?

4. Trust & social proof
   · ${trust}
   · Placement logical in the scroll journey?
   · Trust elements visually credible (real photos vs stock)?

5. Conversion path
   · Clicks to reach: ${goalLabel}?
   · Forms: length appropriate? Inline validation present?
   · Unnecessary popups or modals blocking the path?`;

  const blocks =
    platform === "mobile" ? mb : platform === "desktop" ? db : `${mb}\n${db}`;

  return `You are a senior UX auditor specializing in conversion optimization.

Attached is a screenshot of a website.
Business type: ${indLabel}
Primary conversion goal: ${goalLabel}
Platform scope: ${platLabel}
Key trust signals for this industry: ${trust}
${blocks}

──────────────────────────────────────────────────────
For each area above, rate it:
  ✅ OK  /  ⚠️ NEEDS IMPROVEMENT  /  🔴 CRITICAL

Then provide:

PRIORITY FIXES (top 3, ranked by conversion impact):
1. [Issue] → [Specific fix]
2. [Issue] → [Specific fix]
3. [Issue] → [Specific fix]

QUICK WIN: One change implementable in under 1 hour.

Tone: blunt, actionable. This is an internal brief, not a client-facing report.`;
}
