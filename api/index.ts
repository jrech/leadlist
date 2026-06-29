import app from "../server/app";

/**
 * Vercel serverless entrypoint. Vercel's Node.js runtime treats a default
 * export that is a `(req, res)` handler as the function — and an Express app
 * is exactly that. The `vercel.json` rewrite sends every `/api/*` request here,
 * and Express matches it against the routes defined in `server/app.ts` (which
 * already include the `/api` prefix). No business logic lives here.
 */
export default app;
