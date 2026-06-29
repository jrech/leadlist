# Outreach Studio

AI-powered cold-outreach workflow tool for web designers. Three steps:

1. **Audit prompt** — generate a ChatGPT prompt to audit a website.
2. **Email from result** — turn the audit output into 3 outreach message variants.
3. **Website mockup** — generate a GPT Image prompt for a redesign concept.

Fully bilingual (CS / EN). 100% client-side — the generators are pure functions.

## Stack

React 18 · Vite · TypeScript · TailwindCSS · shadcn/ui (new-york) · React Router · Lucide

## Getting started

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # typecheck + production build
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

Add shadcn components as needed:

```bash
npx shadcn@latest add button select textarea card badge tabs
```

## Architecture

```
src/
  app/              Router, providers, root layout, route constants
  components/
    ui/             shadcn primitives (generated)
    layout/         AppHeader, WorkflowTabs (UI milestone)
    common/         PillGroup, OutputPanel, CopyButton, … (UI milestone)
  data/             Localized datasets — single source of truth
                      industries.ts, goals.ts, visualStyles.ts
  features/
    audit/          Step 1 page + hooks
    email/          Step 2 page + hooks
    mockup/         Step 3 page + hooks
  hooks/            Cross-cutting hooks (useCopyToClipboard)
  i18n/             UI string catalog + LanguageProvider (localStorage-backed)
  lib/
    generators/     Pure prompt builders (audit / mockup / email)
    parseAudit.ts   ChatGPT-output parser
    promptStats.ts  word/char counts
    clipboard.ts    clipboard write + legacy fallback
    utils.ts        cn() class merge
  styles/           globals.css (design tokens as CSS variables)
  types/            domain.ts — shared string-literal unions
```

### Design principles

- **Business logic is framework-free.** Everything in `lib/` and `data/` is
  pure and unit-testable, with no React or DOM dependency. Views call these.
- **One localized data model.** The original PoC's four parallel
  industry objects are consolidated into `data/industries.ts`; each field is
  `{ cs, en }`. Generators select the language at read time.
- **i18n is data, not branching.** UI strings live in `i18n/strings.ts`.
- **Routes are the workflow.** The 3 steps are sibling routes under a shared
  layout — add new tools in `app/router.tsx`.

> The legacy `audit-prompt-generator_1.html` is kept only as the source of
> business logic and is not part of the build.

### Where to grow next

- Build the shared components (`PillGroup`, `OutputPanel`) and feature UIs.
- Optionally wire a store so Step 1 output flows into Steps 2 & 3
  (currently a manual copy-paste in the PoC).
- Add a backend / LLM proxy (`VITE_API_BASE_URL`) to run generations server-side.
