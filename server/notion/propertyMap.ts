import type { CountryId, IndustryId } from "../../src/types/domain";
import type { Lead, LeadContact, LeadPriority, LeadStatus } from "../../src/types/lead";

/**
 * The single source of truth for how `Lead` fields map onto Notion property
 * names and values. Both `mapPageToLead` (read) and `mapLeadPatchToProperties`
 * (write) go through this table.
 *
 * Unlike a typical property map, several of these properties need a value
 * translation, not just a name lookup — the app's internal ids (e.g.
 * `IndustryId`) don't literally match the option labels in the live Notion
 * database. See the translation tables below for why each one differs.
 *
 * Actual Notion property types (verified against the live database):
 *   Company        Title
 *   Website        URL
 *   Country        Select  (Czech Republic, Sweden, Norway, Denmark, Finland, Other)
 *   Industry       Select  (Dental, Legal, Hospitality, Wellness/Fitness,
 *                            Coffee/Café, Beauty/Salon, Real Estate,
 *                            Trades/Construction, Professional Services, Other)
 *   Priority       Select  (Low, Medium, High)
 *   Status         Select  (New, Research, Audit Ready, Mockup Ready,
 *                            Email Ready, Contacted, Follow-up, Won, Lost)
 *   Owner          People  — read-only here: writing would require resolving
 *                            real Notion workspace member ids, which the app
 *                            has no way to do, so it's never included in a
 *                            write payload.
 *   Assignee       Select  (Jonas, Kenneth) — the app-writable owner, added
 *                            because Owner (People) can't be set from the app.
 *   Contact Name   Rich text
 *   Contact Email  Email
 *   Phone          Phone number
 *   Notes          Rich text   — JSON notes timeline (see notionDocs.ts)
 *   Timeline       Rich text   — JSON activity feed (see notionDocs.ts)
 *   Generations    Rich text   — JSON saved prompts (see notionDocs.ts)
 *   Follow-up Date Date
 *   Last Activity  Date
 *   Created Time   Created time  (Notion-managed, never written by us)
 *   Last Edited Time  Last edited time (Notion-managed, never written by us)
 *
 *   There is no "Next Action" property — the app derives that from `status`
 *   instead (see `nextActionForStatus` in `src/features/leads/lead-meta.ts`).
 *   There is no LinkedIn property either, so `LeadContact` has no such field.
 */
export const NOTION_PROPERTY = {
  company: "Company",
  website: "Website",
  country: "Country",
  industry: "Industry",
  priority: "Priority",
  status: "Status",
  owner: "Owner",
  assignee: "Assignee",
  contactName: "Contact Name",
  contactEmail: "Contact Email",
  contactPhone: "Phone",
  lastActivityAt: "Last Activity",
  followUpAt: "Follow-up Date",
} as const;

/**
 * Rich-text properties that hold JSON collections (see `notionDocs.ts`), not
 * plain lead scalars. Kept separate from `NOTION_PROPERTY` because they're
 * read/written by the document helpers, never by `mapPageToLead`.
 *   Notes        the notes timeline (array of note cards)
 *   Timeline     the activity feed (array of events)
 *   Generations  saved prompts, keyed by kind
 */
export const NOTION_DOC_PROPERTY = {
  notes: "Notes",
  timeline: "Timeline",
  generations: "Generations",
} as const;

/**
 * Country is a clean 1:1 slug↔label mapping — no information loss either
 * direction.
 */
const COUNTRY_TO_NOTION: Record<CountryId, string> = {
  czech_republic: "Czech Republic",
  sweden: "Sweden",
  norway: "Norway",
  denmark: "Denmark",
  finland: "Finland",
  other: "Other",
};
const NOTION_TO_COUNTRY: Record<string, CountryId> = Object.fromEntries(
  Object.entries(COUNTRY_TO_NOTION).map(([id, label]) => [label, id as CountryId]),
);

/**
 * Industry is *not* 1:1. The app's 9 ids carry curated, hand-written prompt
 * content (see `src/data/industries.ts`) that must not be rewritten to chase
 * Notion's 10 option labels, so this is a best-effort translation instead of
 * a renamed vocabulary. Reading is lossless for the labels listed; writing
 * is lossy for ids with no real Notion counterpart (adventure, ecommerce,
 * saas, generic all collapse to "Other") — that's an inherent cost of two
 * vocabularies of different shapes, not a bug.
 */
const NOTION_TO_INDUSTRY: Record<string, IndustryId> = {
  Dental: "clinic",
  Legal: "law",
  Hospitality: "hotel",
  "Wellness/Fitness": "generic",
  "Coffee/Café": "restaurant",
  "Beauty/Salon": "generic",
  "Real Estate": "generic",
  "Trades/Construction": "generic",
  "Professional Services": "freelancer",
  Other: "generic",
};
const INDUSTRY_TO_NOTION: Record<IndustryId, string> = {
  clinic: "Dental",
  law: "Legal",
  hotel: "Hospitality",
  adventure: "Other",
  restaurant: "Coffee/Café",
  ecommerce: "Other",
  saas: "Other",
  freelancer: "Professional Services",
  generic: "Other",
};

const PRIORITY_TO_NOTION: Record<LeadPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
const NOTION_TO_PRIORITY: Record<string, LeadPriority> = Object.fromEntries(
  Object.entries(PRIORITY_TO_NOTION).map(([id, label]) => [label, id as LeadPriority]),
);

/** Status ids are slugs of the real Notion option labels — also 1:1. */
const STATUS_TO_NOTION: Record<LeadStatus, string> = {
  new: "New",
  research: "Research",
  audit_ready: "Audit Ready",
  mockup_ready: "Mockup Ready",
  email_ready: "Email Ready",
  contacted: "Contacted",
  follow_up: "Follow-up",
  won: "Won",
  lost: "Lost",
};
const NOTION_TO_STATUS: Record<string, LeadStatus> = Object.fromEntries(
  Object.entries(STATUS_TO_NOTION).map(([id, label]) => [label, id as LeadStatus]),
);

/** A Notion page as returned by the REST API — only the fields we use. */
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: Record<string, NotionPropertyValue>;
}

/** Loosely typed — Notion's property union is large; we only read a subset. */
type NotionPropertyValue = Record<string, unknown>;

/** Patch shape accepted from the client (a subset of Lead's writable fields). */
export interface LeadPatch {
  company?: string;
  website?: string;
  country?: CountryId;
  industry?: IndustryId;
  priority?: LeadPriority;
  status?: LeadStatus;
  assignee?: string;
  lastActivityAt?: string;
  followUpAt?: string;
  contact?: LeadContact;
}

/**
 * Looks up `value` in `table`, falling back to `fallback` (and logging) when
 * it's missing — e.g. a Notion select option that's been renamed since this
 * map was written. Falling back silently is exactly how the last schema
 * mismatch went unnoticed, so this always surfaces the drift instead.
 */
function translate<T extends string>(
  value: string | null,
  table: Record<string, T>,
  fallback: T,
  propertyName: string,
): T {
  if (value === null) return fallback;
  const translated = table[value];
  if (translated === undefined) {
    console.warn(
      `[notion] Unrecognized "${propertyName}" value "${value}" — falling back to "${fallback}". ` +
        "The Notion select option may have changed; update server/notion/propertyMap.ts.",
    );
    return fallback;
  }
  return translated;
}

function readTitle(prop: NotionPropertyValue | undefined): string {
  const title = (prop?.title as { plain_text: string }[] | undefined) ?? [];
  return title.map((t) => t.plain_text).join("");
}

function readRichText(prop: NotionPropertyValue | undefined): string {
  const richText = (prop?.rich_text as { plain_text: string }[] | undefined) ?? [];
  return richText.map((t) => t.plain_text).join("");
}

function readUrl(prop: NotionPropertyValue | undefined): string | null {
  return (prop?.url as string | null | undefined) ?? null;
}

function readSelect(prop: NotionPropertyValue | undefined): string | null {
  const select = prop?.select as { name: string } | null | undefined;
  return select?.name ?? null;
}

function readEmail(prop: NotionPropertyValue | undefined): string | null {
  return (prop?.email as string | null | undefined) ?? null;
}

function readPhone(prop: NotionPropertyValue | undefined): string | null {
  return (prop?.phone_number as string | null | undefined) ?? null;
}

function readDate(prop: NotionPropertyValue | undefined): string | null {
  const date = prop?.date as { start: string } | null | undefined;
  return date?.start ?? null;
}

/** Joins a Notion `people` property's display names — read-only, see NOTION_PROPERTY.owner. */
function readOwner(prop: NotionPropertyValue | undefined): string | undefined {
  const people = (prop?.people as { name?: string }[] | undefined) ?? [];
  const names = people.map((p) => p.name).filter((name): name is string => Boolean(name));
  return names.length > 0 ? names.join(", ") : undefined;
}

function readContact(properties: NotionPage["properties"]): LeadContact | undefined {
  const name = readRichText(properties[NOTION_PROPERTY.contactName]);
  const email = readEmail(properties[NOTION_PROPERTY.contactEmail]);
  const phone = readPhone(properties[NOTION_PROPERTY.contactPhone]);
  if (!name && !email && !phone) return undefined;
  return {
    name: name || undefined,
    email: email || undefined,
    phone: phone || undefined,
  };
}

/**
 * Converts a Notion page into the app's `Lead` shape. `id`/`externalId`
 * are both the Notion page id (kept identical so a lead is addressable by
 * either field); `createdAt`/`updatedAt` come from Notion's own
 * automatically-maintained timestamps, never from a property we write.
 */
export function mapPageToLead(page: NotionPage): Lead {
  const p = page.properties;
  return {
    id: page.id,
    externalId: page.id,
    company: readTitle(p[NOTION_PROPERTY.company]),
    website: readUrl(p[NOTION_PROPERTY.website]) ?? "",
    country: translate(
      readSelect(p[NOTION_PROPERTY.country]),
      NOTION_TO_COUNTRY,
      "other",
      NOTION_PROPERTY.country,
    ),
    industry: translate(
      readSelect(p[NOTION_PROPERTY.industry]),
      NOTION_TO_INDUSTRY,
      "generic",
      NOTION_PROPERTY.industry,
    ),
    priority: translate(
      readSelect(p[NOTION_PROPERTY.priority]),
      NOTION_TO_PRIORITY,
      "medium",
      NOTION_PROPERTY.priority,
    ),
    status: translate(
      readSelect(p[NOTION_PROPERTY.status]),
      NOTION_TO_STATUS,
      "new",
      NOTION_PROPERTY.status,
    ),
    owner: readOwner(p[NOTION_PROPERTY.owner]),
    assignee: readSelect(p[NOTION_PROPERTY.assignee]) ?? undefined,
    lastActivityAt: readDate(p[NOTION_PROPERTY.lastActivityAt]) ?? undefined,
    followUpAt: readDate(p[NOTION_PROPERTY.followUpAt]) ?? undefined,
    contact: readContact(p),
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
}

function titleProp(text: string) {
  return { title: text ? [{ text: { content: text } }] : [] };
}
function richTextProp(text: string) {
  return { rich_text: text ? [{ text: { content: text } }] : [] };
}
function urlProp(value: string | null | undefined) {
  return { url: value || null };
}
function selectProp(value: string | null | undefined) {
  return { select: value ? { name: value } : null };
}
function emailProp(value: string | null | undefined) {
  return { email: value || null };
}
function phoneProp(value: string | null | undefined) {
  return { phone_number: value || null };
}
function dateProp(value: string | null | undefined) {
  return { date: value ? { start: value } : null };
}

/**
 * Converts a partial `Lead` patch into Notion property-write payloads.
 * Only keys present in `patch` are included, so a PATCH only touches the
 * Notion properties that actually changed — this is what both `createLead`
 * (given a full patch) and `updateLead` (given a partial one) call.
 *
 * `owner` is deliberately not settable here — see NOTION_PROPERTY.owner.
 */
export function mapLeadPatchToProperties(patch: LeadPatch): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  if (patch.company !== undefined) props[NOTION_PROPERTY.company] = titleProp(patch.company);
  if (patch.website !== undefined) props[NOTION_PROPERTY.website] = urlProp(patch.website);
  if (patch.country !== undefined) {
    props[NOTION_PROPERTY.country] = selectProp(COUNTRY_TO_NOTION[patch.country]);
  }
  if (patch.industry !== undefined) {
    props[NOTION_PROPERTY.industry] = selectProp(INDUSTRY_TO_NOTION[patch.industry]);
  }
  if (patch.priority !== undefined) {
    props[NOTION_PROPERTY.priority] = selectProp(PRIORITY_TO_NOTION[patch.priority]);
  }
  if (patch.status !== undefined) {
    props[NOTION_PROPERTY.status] = selectProp(STATUS_TO_NOTION[patch.status]);
  }
  if (patch.assignee !== undefined) {
    props[NOTION_PROPERTY.assignee] = selectProp(patch.assignee || null);
  }
  if (patch.lastActivityAt !== undefined) {
    props[NOTION_PROPERTY.lastActivityAt] = dateProp(patch.lastActivityAt);
  }
  if (patch.followUpAt !== undefined) {
    props[NOTION_PROPERTY.followUpAt] = dateProp(patch.followUpAt);
  }
  if (patch.contact !== undefined) {
    props[NOTION_PROPERTY.contactName] = richTextProp(patch.contact?.name ?? "");
    props[NOTION_PROPERTY.contactEmail] = emailProp(patch.contact?.email);
    props[NOTION_PROPERTY.contactPhone] = phoneProp(patch.contact?.phone);
  }

  return props;
}
