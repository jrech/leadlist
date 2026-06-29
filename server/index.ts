import app from "./app";

/**
 * Local development entry. Vercel never runs this file — there, `api/index.ts`
 * re-exports the same app as a serverless function. Here we start a real HTTP
 * listener so `npm run server` (and `npm run dev:all`) behave exactly as
 * before: Vite's dev proxy forwards `/api/*` to this port.
 */
const PORT = Number(process.env.PORT ?? 8787);

app.listen(PORT, () => {
  console.log(`[server] Notion proxy listening on http://localhost:${PORT}`);
});
