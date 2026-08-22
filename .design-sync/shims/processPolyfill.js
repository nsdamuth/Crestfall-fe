// Side-effect-only shim. lib/shared/flags/sidebarV2Preview.js reads
// process.env.NEXT_PUBLIC_SIDEBAR_V2_PREVIEW and process.env.NODE_ENV
// directly; Next.js statically replaces every such reference at build
// time, but esbuild's own define pass here only covers process.env.NODE_ENV
// (see .design-sync/config.json buildCmd / lib/bundle.mjs). Outside Next,
// `process` itself is undefined in the browser, so the unmatched
// NEXT_PUBLIC_SIDEBAR_V2_PREVIEW reference throws ReferenceError at render
// time. This polyfills a minimal process.env matching real production
// behavior (the flag unset, NODE_ENV production -> preview nav off by
// default), imported for its side effect only, before the flag is read.
if (typeof globalThis.process === "undefined") {
  globalThis.process = { env: { NODE_ENV: "production" } };
}
