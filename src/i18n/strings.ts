import type { Language } from "@/types/domain";

/**
 * UI string catalog. Ported from the original `i18n` object, minus the
 * dataset fields (industries/goals/styles) which now live in src/data.
 * Each top-level key is a language; keep the two shapes identical.
 */
export interface UIStrings {
  headerSub: string;

  // Tabs / workflow steps
  tabAudit: string;
  tabEmail: string;
  tabMockup: string;

  // Step 1 — audit
  lblClient: string;
  lblIndustry: string;
  lblGoal: string;
  lblPlatform: string;
  lblOutput: string;
  pMobile: string;
  pDesktop: string;
  pBoth: string;
  oSingle: string;
  oFull: string;
  hintSingle: string;
  hintSingleDesc: string;
  hintFull: string;
  hintFullDesc: string;
  btnGenerate: string;
  emptyTitle: string;
  emptySub: string;
  outputReady: string;
  statWords: string;
  statChars: string;
  platformLabels: Record<"mobile" | "desktop" | "both", string>;
  typeLabels: Record<"single" | "full", string>;

  // Step 2 — email
  lblInput: string;
  lblPaste: string;
  lblDetails: string;
  lblCompany: string;
  lblContact: string;
  lblYourname: string;
  lblChannel: string;
  btnEmail: string;
  emailEmptyTitle: string;
  emailEmptySub: string;
  needResult: string;
  subjectLabel: string;
  variants: { badge: string; desc: string }[];

  // Step 3 — mockup
  mLblContext: string;
  mLblIndustry: string;
  mLblProblem: string;
  mLblScope: string;
  mLblStyle: string;
  mLblDevice: string;
  scFull: string;
  scHero: string;
  scSection: string;
  dvBoth: string;
  dvDesktop: string;
  dvTablet: string;
  dvMobile: string;
  stClean: string;
  stPremium: string;
  stBold: string;
  btnMockup: string;
  mockupEmptyTitle: string;
  mockupEmptySub: string;
  mockupNeedProblem: string;
  mockupStatNote: string;
  mockupStatHint: string;
  scopeLabels: Record<"full" | "hero" | "section", string>;
  styleLabels: Record<"clean" | "premium" | "bold", string>;
  deviceLabels: Record<"both" | "desktop" | "tablet" | "mobile", string>;

  // Shared
  copyLabel: string;
  copiedLabel: string;
  copyFailed: string;
}

export const STRINGS: Record<Language, UIStrings> = {
  cs: {
    headerSub:
      "Od auditu k odeslanému emailu — celý cold outreach workflow",
    tabAudit: "Audit prompt",
    tabEmail: "Email z výsledku",
    tabMockup: "Mockup webu",
    lblClient: "Klient",
    lblIndustry: "Obor",
    lblGoal: "Konverzní cíl",
    lblPlatform: "Platforma",
    lblOutput: "Typ výstupu",
    pMobile: "Mobil",
    pDesktop: "Desktop",
    pBoth: "Obojí",
    oSingle: "Cold outreach",
    oFull: "Plný audit",
    hintSingle: "Cold outreach",
    hintSingleDesc: "jedna kritická věc, max 5 vět.",
    hintFull: "Plný audit",
    hintFullDesc: "interní brief před discovery callem.",
    btnGenerate: "Vygenerovat prompt",
    emptyTitle: "Prompt čeká na generování",
    emptySub:
      "Vyber obor, konverzní cíl, platformu a typ auditu — pak klikni na tlačítko vlevo.",
    outputReady: "Připraveno pro",
    statWords: "slov",
    statChars: "znaků",
    platformLabels: {
      mobile: "Mobil (390px)",
      desktop: "Desktop (1440px)",
      both: "Mobil + Desktop",
    },
    typeLabels: { single: "Cold outreach", full: "Plný audit" },
    lblInput: "Výsledek z ChatGPT",
    lblPaste: "Vlož sem výstup auditu",
    lblDetails: "Detaily",
    lblCompany: "Název firmy",
    lblContact: "Jméno kontaktu (volitelné)",
    lblYourname: "Tvé jméno",
    lblChannel: "Kanál",
    btnEmail: "Vygenerovat zprávy",
    emailEmptyTitle: "Zprávy se objeví tady",
    emailEmptySub:
      "Vlož výsledek auditu z ChatGPT a vyplň detaily firmy. Vygeneruju ti 3 strategicky odlišné varianty.",
    needResult: "Nejdřív vlož výsledek auditu z ChatGPT.",
    subjectLabel: "Předmět",
    variants: [
      { badge: "Přímý", desc: "Rovnou k věci, vysoká důvěra" },
      { badge: "Soft", desc: "Přátelský, nízký tlak" },
      { badge: "Value-first", desc: "Hodnota dřív než pitch" },
    ],
    mLblContext: "Kontext",
    mLblIndustry: "Obor",
    mLblProblem: "Problém z auditu (vlož z ChatGPT)",
    mLblScope: "Co zobrazit",
    mLblStyle: "Vizuální směr",
    mLblDevice: "Zařízení",
    scFull: "Celá homepage",
    scHero: "Hero / first screen",
    scSection: "Sekce s problémem",
    dvBoth: "Desktop + mobil",
    dvDesktop: "Desktop",
    dvTablet: "Tablet",
    dvMobile: "Mobil",
    stClean: "Clean / minimal",
    stPremium: "Premium",
    stBold: "Bold",
    btnMockup: "Vygenerovat image prompt",
    mockupEmptyTitle: "Image prompt se objeví tady",
    mockupEmptySub:
      "Vlož problém z auditu a vyber rozsah. Vygeneruju prompt pro GPT Image, který zmodernizuje web a opraví ten konkrétní problém.",
    mockupNeedProblem: "Nejdřív vlož problém z auditu.",
    mockupStatNote: "Vlož do",
    mockupStatHint: "Concept mockup, ne produkční web",
    scopeLabels: { full: "Celá homepage", hero: "Hero", section: "Sekce" },
    styleLabels: { clean: "Clean", premium: "Premium", bold: "Bold" },
    deviceLabels: {
      both: "Desktop + mobil",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobil",
    },
    copyLabel: "Kopírovat",
    copiedLabel: "Zkopírováno",
    copyFailed:
      "Kopírování selhalo. Označ text a zkopíruj ručně (Ctrl+C).",
  },
  en: {
    headerSub: "From audit to sent email — the full cold outreach workflow",
    tabAudit: "Audit prompt",
    tabEmail: "Email from result",
    tabMockup: "Website mockup",
    lblClient: "Client",
    lblIndustry: "Industry",
    lblGoal: "Conversion goal",
    lblPlatform: "Platform",
    lblOutput: "Output type",
    pMobile: "Mobile",
    pDesktop: "Desktop",
    pBoth: "Both",
    oSingle: "Cold outreach",
    oFull: "Full audit",
    hintSingle: "Cold outreach",
    hintSingleDesc: "one critical issue, max 5 sentences.",
    hintFull: "Full audit",
    hintFullDesc: "internal brief before a discovery call.",
    btnGenerate: "Generate prompt",
    emptyTitle: "Prompt ready to generate",
    emptySub:
      "Choose an industry, conversion goal, platform and output type — then click the button on the left.",
    outputReady: "Ready for",
    statWords: "words",
    statChars: "chars",
    platformLabels: {
      mobile: "Mobile (390px)",
      desktop: "Desktop (1440px)",
      both: "Mobile + Desktop",
    },
    typeLabels: { single: "Cold outreach", full: "Full audit" },
    lblInput: "ChatGPT result",
    lblPaste: "Paste the audit output here",
    lblDetails: "Details",
    lblCompany: "Company name",
    lblContact: "Contact name (optional)",
    lblYourname: "Your name",
    lblChannel: "Channel",
    btnEmail: "Generate messages",
    emailEmptyTitle: "Messages will appear here",
    emailEmptySub:
      "Paste the audit result from ChatGPT and fill in the company details. I'll generate 3 strategically different variants.",
    needResult: "Paste the audit result from ChatGPT first.",
    subjectLabel: "Subject",
    variants: [
      { badge: "Direct", desc: "Straight to the point, high confidence" },
      { badge: "Soft", desc: "Friendly, low pressure" },
      { badge: "Value-first", desc: "Value before the pitch" },
    ],
    mLblContext: "Context",
    mLblIndustry: "Industry",
    mLblProblem: "Audit problem (paste from ChatGPT)",
    mLblScope: "What to show",
    mLblStyle: "Visual direction",
    mLblDevice: "Device",
    scFull: "Full homepage",
    scHero: "Hero / first screen",
    scSection: "Problem section",
    dvBoth: "Desktop + mobile",
    dvDesktop: "Desktop",
    dvTablet: "Tablet",
    dvMobile: "Mobile",
    stClean: "Clean / minimal",
    stPremium: "Premium",
    stBold: "Bold",
    btnMockup: "Generate image prompt",
    mockupEmptyTitle: "Image prompt will appear here",
    mockupEmptySub:
      "Paste the audit problem and pick a scope. I'll generate a GPT Image prompt that modernizes the site and fixes that specific problem.",
    mockupNeedProblem: "Paste the audit problem first.",
    mockupStatNote: "Paste into",
    mockupStatHint: "Concept mockup, not a production site",
    scopeLabels: { full: "Full homepage", hero: "Hero", section: "Section" },
    styleLabels: { clean: "Clean", premium: "Premium", bold: "Bold" },
    deviceLabels: {
      both: "Desktop + mobile",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
    },
    copyLabel: "Copy",
    copiedLabel: "Copied",
    copyFailed: "Copy failed. Select the text and copy manually (Ctrl+C).",
  },
};
