# Outreach Studio

## Purpose

Outreach Studio is an internal AI-powered outreach platform for freelance web designers and small agencies.

The goal is to dramatically reduce the time between finding a lead and sending a high-quality personalized outreach email.

This is not a generic CRM. It is a workflow application built around AI.

## Core Workflow

Every lead should naturally move through this pipeline:

```
Lead → Audit → Mockup → Email → Sent → Follow-up → Client
```

Every screen should help users answer one question: **What is the next action?**

## Product Philosophy

- Prioritize workflow over features.
- Avoid feature bloat, unnecessary settings, enterprise CRM complexity.
- The application should feel focused, opinionated, and extremely fast.
- Whenever there are multiple possible implementations, prefer the one requiring fewer clicks.

## Design Inspiration

Use these products as inspiration — do NOT copy them, recreate their design philosophy:

- Linear
- Vercel
- Raycast
- Notion
- Arc Browser

## Visual Design

- Dark mode only.
- Premium SaaS quality.
- Minimal. Large whitespace. Subtle borders. Rounded cards. Soft shadows. Muted colors. Purple accent.
- No gradients. No glassmorphism. No neumorphism. No flashy animations.
- Everything should feel calm and intentional.

## UI Principles

Every page should have:
- one primary action
- clear visual hierarchy
- generous spacing
- predictable layouts

Avoid: clutter, unnecessary icons, too many buttons, overwhelming dashboards, visual noise.

Cards should breathe. Tables should remain readable with hundreds of leads.

## UX Principles

- Guide users through the workflow. Never ask users to think about what comes next.
- Use progressive disclosure — hide advanced information until needed.
- The interface should feel like a senior designer's personal tool.

## Coding Principles

### Stack
React · Vite · TypeScript · TailwindCSS · shadcn/ui · React Router · Lucide Icons

### Architecture
Separate: UI / business logic / prompt generation / data layer.

- Never mix business logic with UI components.
- Never duplicate prompt logic.
- Always prefer reusable components.
- Keep components small. Prefer composition over inheritance.
- Keep files easy to read.

### Existing Business Logic
The original HTML prototype (`audit-prompt-generator_1.html`) contains valuable business logic. Do NOT rewrite it. Instead: preserve prompt quality, datasets, translation logic, and prompt templates. Only modernize architecture.

### AI Prompt Generation
Prompt quality is the product.
- Never simplify, shorten, or change prompt outputs unless explicitly requested.
- Prompt generation is a reusable engine (see `src/lib/prompt-engine/`).

### Lead Philosophy
The Lead Detail page is the heart of the application. Everything revolves around a lead. Think in terms of workflow, not tools.

### Database
The application uses Notion as the backend. Communicate through a data layer:

```
UI → LeadService → Notion API
```

Never couple UI directly to Notion. The data layer should make it easy to migrate to Supabase in the future. (See `src/data/repositories/` for the prepared seam.)

## Development Workflow

Before writing code:
1. Understand the existing architecture.
2. Inspect reusable components.
3. Reuse existing types.
4. Explain the implementation plan.
5. Then implement.

Never rewrite working code unless it significantly improves maintainability.

## Design System

- **Typography** — clean sans-serif, premium spacing, strong hierarchy.
- **Spacing** — generous padding, consistent margins, avoid crowded layouts.
- **Buttons** — one clear primary CTA, subtle secondary actions.
- **Cards** — rounded, bordered, breathable.
- **Animations** — subtle, fast, purposeful.

## Code Quality

Always optimize for readability, maintainability, scalability. Avoid clever code. Prefer obvious code. The next developer should immediately understand every component.

## Roadmap

- M1 — Project setup ✅
- M2 — App shell ✅
- M3 — Lead List ✅
- M4 — Lead Detail ✅
- M5 — Audit Generator ✅
- M6 — Mockup Generator ✅
- M7 — Email Generator ✅
- M8 — Timeline
- M9 — Notion Integration
- M10 — AI Automation

Only work on the current milestone unless explicitly instructed otherwise. Never skip milestones.
