import type { NotionPage } from "./propertyMap";

const NOTION_VERSION = "2022-06-28";
const NOTION_API_BASE = "https://api.notion.com/v1";

export interface NotionConfig {
  apiKey: string;
  databaseId: string;
}

/** Thrown for any non-2xx response from the Notion API, with the real status. */
export class NotionApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "NotionApiError";
  }
}

async function notionFetch(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`${NOTION_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new NotionApiError(
      res.status,
      body.message ?? `Notion API request failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Verifies the API token by hitting a cheap authenticated endpoint
 * (`/users/me`). Throws `NotionApiError` if the token is missing/invalid or
 * Notion is unreachable — used by the health check, which never touches the
 * database itself.
 */
export async function verifyToken(config: NotionConfig): Promise<void> {
  await notionFetch(config.apiKey, "/users/me");
}

/**
 * Fetches every page in the configured database, following pagination
 * automatically. Notion returns at most 100 results per request.
 */
export async function queryAllPages(config: NotionConfig): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const data = (await notionFetch(
      config.apiKey,
      `/databases/${config.databaseId}/query`,
      { method: "POST", body: JSON.stringify(body) },
    )) as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };

    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);

  return pages;
}

/** Returns `null` (rather than throwing) when the page doesn't exist. */
export async function retrievePage(
  config: NotionConfig,
  pageId: string,
): Promise<NotionPage | null> {
  try {
    return (await notionFetch(config.apiKey, `/pages/${pageId}`)) as NotionPage;
  } catch (err) {
    if (err instanceof NotionApiError && err.status === 404) return null;
    throw err;
  }
}

export async function createPage(
  config: NotionConfig,
  properties: Record<string, unknown>,
): Promise<NotionPage> {
  return (await notionFetch(config.apiKey, "/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: config.databaseId },
      properties,
    }),
  })) as NotionPage;
}

export async function updatePage(
  config: NotionConfig,
  pageId: string,
  properties: Record<string, unknown>,
): Promise<NotionPage> {
  return (await notionFetch(config.apiKey, `/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  })) as NotionPage;
}

/** Archives a page using Notion's native page-level `archived` flag. */
export async function archivePage(
  config: NotionConfig,
  pageId: string,
): Promise<NotionPage> {
  return (await notionFetch(config.apiKey, `/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ archived: true }),
  })) as NotionPage;
}
