import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response } from "express";

import {
  archivePage,
  createPage,
  NotionApiError,
  queryAllPages,
  retrievePage,
  updatePage,
  verifyToken,
  type NotionConfig,
} from "./notion/notionApi";
import { readDoc, writeDoc } from "./notion/notionDocs";
import {
  mapLeadPatchToProperties,
  mapPageToLead,
  NOTION_DOC_PROPERTY,
  type LeadPatch,
} from "./notion/propertyMap";

/**
 * The configured Express app — all middleware, routes, and business logic.
 * Deliberately free of `app.listen`: the local dev entry (`server/index.ts`)
 * starts a listener, while the Vercel serverless entry (`api/index.ts`)
 * re-exports this app as its default handler. One app, two entrypoints, so
 * the routing and logic below exist in exactly one place.
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.warn(
    "[server] NOTION_API_KEY and/or NOTION_DATABASE_ID are not set. " +
      "Every request will return a clear 500 until both are configured " +
      "(copy .env.example to .env and fill them in locally, or set them in " +
      "the Vercel project's Environment Variables).",
  );
}

const config: NotionConfig = {
  apiKey: NOTION_API_KEY ?? "",
  databaseId: NOTION_DATABASE_ID ?? "",
};

/** Guards every route — returns false (and responds) if Notion isn't configured. */
function requireConfig(res: Response): boolean {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    res.status(500).json({
      error: "Server is not configured: missing NOTION_API_KEY or NOTION_DATABASE_ID.",
    });
    return false;
  }
  return true;
}

/** Maps a NotionApiError to its real HTTP status; anything else is a 500. */
function handleError(res: Response, err: unknown): void {
  if (err instanceof NotionApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error("[server] Unexpected error:", err);
  res.status(500).json({ error: "Unexpected server error." });
}

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /api/health — lightweight workspace health signal for the Dashboard.
 * Pings Notion's `/users/me` to confirm the token works, without querying the
 * database. Always responds 200; the payload's `status` carries the result so
 * the client can render a health widget rather than treat it as a hard error.
 */
app.get("/api/health", async (_req: Request, res: Response) => {
  const checkedAt = new Date().toISOString();
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    res.json({
      status: "misconfigured",
      notionConnected: false,
      checkedAt,
      message: "Missing NOTION_API_KEY or NOTION_DATABASE_ID.",
    });
    return;
  }
  try {
    await verifyToken(config);
    res.json({ status: "ok", notionConnected: true, checkedAt });
  } catch (err) {
    res.json({
      status: "error",
      notionConnected: false,
      checkedAt,
      message: err instanceof NotionApiError ? err.message : "Notion API unreachable.",
    });
  }
});

/** GET /api/notion/leads — every lead in the configured database. */
app.get("/api/notion/leads", async (_req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const pages = await queryAllPages(config);
    res.json(pages.map(mapPageToLead));
  } catch (err) {
    handleError(res, err);
  }
});

/** GET /api/notion/leads/:id — a single lead, or null if it doesn't exist. */
app.get("/api/notion/leads/:id", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const page = await retrievePage(config, req.params.id);
    res.json(page ? mapPageToLead(page) : null);
  } catch (err) {
    handleError(res, err);
  }
});

/** POST /api/notion/leads — creates a new Notion page immediately. */
app.post("/api/notion/leads", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const properties = mapLeadPatchToProperties(req.body as LeadPatch);
    const page = await createPage(config, properties);
    res.status(201).json(mapPageToLead(page));
  } catch (err) {
    handleError(res, err);
  }
});

/** PATCH /api/notion/leads/:id — partial update; only supplied fields change. */
app.patch("/api/notion/leads/:id", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const properties = mapLeadPatchToProperties(req.body as LeadPatch);
    const page = await updatePage(config, req.params.id, properties);
    res.json(mapPageToLead(page));
  } catch (err) {
    handleError(res, err);
  }
});

/** POST /api/notion/leads/:id/archive — sets Notion's native archived flag. */
app.post("/api/notion/leads/:id/archive", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const page = await archivePage(config, req.params.id);
    res.json(mapPageToLead(page));
  } catch (err) {
    handleError(res, err);
  }
});

// ---------------------------------------------------------------------------
// Per-lead JSON collections (notes, timeline, generations)
//
// Each lives as a chunked-JSON rich-text property on the lead page itself (see
// notionDocs.ts), so they restore on one page fetch. Mutations are
// read-modify-write: read the current doc, change it, write it back. Fine for
// this single-operator internal tool; a multi-writer setup would need locking.
// ---------------------------------------------------------------------------

/** Server-assigned id for an item inside a JSON collection. */
function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface StoredNote {
  id: string;
  leadId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/** Any object with an id — timeline events and generations are stored loosely. */
type StoredItem = Record<string, unknown> & { id: string };

/** GET notes — newest first (the doc is already stored that way). */
app.get("/api/notion/leads/:id/notes", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    res.json(await readDoc<StoredNote[]>(config, req.params.id, NOTION_DOC_PROPERTY.notes, []));
  } catch (err) {
    handleError(res, err);
  }
});

/** POST a note — prepends so newest stays first. */
app.post("/api/notion/leads/:id/notes", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const { author, content } = req.body as { author?: string; content?: string };
    const now = new Date().toISOString();
    const note: StoredNote = {
      id: newId("note"),
      leadId: req.params.id,
      author: author ?? "Unknown",
      content: content ?? "",
      createdAt: now,
      updatedAt: now,
    };
    const notes = await readDoc<StoredNote[]>(config, req.params.id, NOTION_DOC_PROPERTY.notes, []);
    notes.unshift(note);
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.notes, notes);
    res.status(201).json(note);
  } catch (err) {
    handleError(res, err);
  }
});

/** PATCH a note's content. */
app.patch("/api/notion/leads/:id/notes/:noteId", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const { content } = req.body as { content?: string };
    const notes = await readDoc<StoredNote[]>(config, req.params.id, NOTION_DOC_PROPERTY.notes, []);
    const note = notes.find((n) => n.id === req.params.noteId);
    if (!note) {
      res.status(404).json({ error: "Note not found." });
      return;
    }
    note.content = content ?? "";
    note.updatedAt = new Date().toISOString();
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.notes, notes);
    res.json(note);
  } catch (err) {
    handleError(res, err);
  }
});

/** DELETE a note. */
app.delete("/api/notion/leads/:id/notes/:noteId", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const notes = await readDoc<StoredNote[]>(config, req.params.id, NOTION_DOC_PROPERTY.notes, []);
    const next = notes.filter((n) => n.id !== req.params.noteId);
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.notes, next);
    res.status(204).end();
  } catch (err) {
    handleError(res, err);
  }
});

/** GET the activity timeline — newest first. */
app.get("/api/notion/leads/:id/timeline", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const events = await readDoc<StoredItem[]>(
      config,
      req.params.id,
      NOTION_DOC_PROPERTY.timeline,
      [],
    );
    events.sort((a, b) =>
      String(b.occurredAt ?? "").localeCompare(String(a.occurredAt ?? "")),
    );
    res.json(events);
  } catch (err) {
    handleError(res, err);
  }
});

/** POST a timeline event. */
app.post("/api/notion/leads/:id/timeline", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const event: StoredItem = {
      ...(req.body as Record<string, unknown>),
      id: newId("tl"),
      createdAt: new Date().toISOString(),
    };
    const events = await readDoc<StoredItem[]>(
      config,
      req.params.id,
      NOTION_DOC_PROPERTY.timeline,
      [],
    );
    events.push(event);
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.timeline, events);
    res.status(201).json(event);
  } catch (err) {
    handleError(res, err);
  }
});

/** GET saved generations — the values of the kind-keyed store. */
app.get("/api/notion/leads/:id/generations", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const store = await readDoc<Record<string, StoredItem>>(
      config,
      req.params.id,
      NOTION_DOC_PROPERTY.generations,
      {},
    );
    res.json(Object.values(store));
  } catch (err) {
    handleError(res, err);
  }
});

/** POST a generation — keyed by kind, so a regenerate overwrites the prior one. */
app.post("/api/notion/leads/:id/generations", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const body = req.body as Record<string, unknown> & { kind?: string };
    if (!body.kind) {
      res.status(400).json({ error: "Generation 'kind' is required." });
      return;
    }
    const generation: StoredItem = {
      ...body,
      id: newId("gen"),
      createdAt: new Date().toISOString(),
    };
    const store = await readDoc<Record<string, StoredItem>>(
      config,
      req.params.id,
      NOTION_DOC_PROPERTY.generations,
      {},
    );
    store[body.kind] = generation;
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.generations, store);
    res.status(201).json(generation);
  } catch (err) {
    handleError(res, err);
  }
});

/** PATCH the saved generation of a given kind (an edit to its output). */
app.patch("/api/notion/leads/:id/generations/:kind", async (req: Request, res: Response) => {
  if (!requireConfig(res)) return;
  try {
    const store = await readDoc<Record<string, StoredItem>>(
      config,
      req.params.id,
      NOTION_DOC_PROPERTY.generations,
      {},
    );
    const current = store[req.params.kind];
    if (!current) {
      res.status(404).json({ error: "Generation not found." });
      return;
    }
    const updated: StoredItem = {
      ...current,
      ...(req.body as Record<string, unknown>),
      id: current.id,
      updatedAt: new Date().toISOString(),
    };
    store[req.params.kind] = updated;
    await writeDoc(config, req.params.id, NOTION_DOC_PROPERTY.generations, store);
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});

export default app;
