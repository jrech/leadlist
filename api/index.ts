// Vercel serverless entrypoint — committed so Vercel detects and builds the
// function (it discovers functions from the source tree in /api).
//
// `./_app.js` is a self-contained bundle of the Express app (server/app.ts),
// produced by `npm run build:api` (esbuild) during the build and git-ignored.
// Importing the prebuilt bundle — instead of `../server/app` directly — is what
// keeps the deployed function free of unresolved cross-file imports, which was
// the cause of the earlier `ERR_MODULE_NOT_FOUND`. Every route and all business
// logic lives in server/app.ts; this file is only the entry.
//
// @ts-ignore - generated build artifact; exists only after `npm run build:api`.
import app from "./_app.js";

export default app;
