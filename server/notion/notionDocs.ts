import { retrievePage, updatePage, type NotionConfig } from "./notionApi";
import type { NotionPage } from "./propertyMap";

/**
 * Stores structured collections (notes, timeline, generations) as JSON inside
 * a lead page's own rich-text properties — see `NOTION_DOC_PROPERTY`. This is
 * the persistence backbone for M15: everything a lead accumulates lives on the
 * lead page itself, so a single `retrievePage` restores it all on refresh,
 * with no extra databases or queries.
 *
 * Notion caps a single rich-text node at 2000 characters, so writes split the
 * JSON across as many ~1900-char nodes as needed; reads concatenate every
 * node's `plain_text` back into one string before parsing. Notion allows up to
 * 100 nodes per property (~190k chars), far more than a lead realistically
 * holds.
 */
const CHUNK_SIZE = 1900;

function richTextToString(prop: NotionPage["properties"][string] | undefined): string {
  const nodes = (prop?.rich_text as { plain_text: string }[] | undefined) ?? [];
  return nodes.map((node) => node.plain_text).join("");
}

/** Splits a JSON string into Notion-safe rich-text nodes. */
function toRichText(value: string) {
  if (!value) return { rich_text: [] };
  const nodes: { text: { content: string } }[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    nodes.push({ text: { content: value.slice(i, i + CHUNK_SIZE) } });
  }
  return { rich_text: nodes };
}

/**
 * Reads and parses a JSON document property, returning `fallback` when the
 * page is missing, the property is empty, or the content isn't valid JSON
 * (e.g. a property that previously held plain text). Never throws on bad data.
 */
export async function readDoc<T>(
  config: NotionConfig,
  pageId: string,
  propName: string,
  fallback: T,
): Promise<T> {
  const page = await retrievePage(config, pageId);
  if (!page) return fallback;
  const raw = richTextToString(page.properties[propName]);
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serializes `data` to JSON and writes it to a chunked rich-text property. */
export async function writeDoc(
  config: NotionConfig,
  pageId: string,
  propName: string,
  data: unknown,
): Promise<void> {
  await updatePage(config, pageId, { [propName]: toRichText(JSON.stringify(data)) });
}
