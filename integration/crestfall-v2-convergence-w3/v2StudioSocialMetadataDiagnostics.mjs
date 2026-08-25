import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("root metadata uses crestfall-studio.com as the integrated canonical origin", () => {
  const layout = read("app/layout.js");

  assert.match(layout, /NEXT_PUBLIC_SITE_URL \|\| "https:\/\/crestfall-studio\.com"/);
  assert.match(layout, /metadataBase: new URL\(PUBLIC_SITE_URL\)/);
  assert.match(layout, /canonical: "\/"/);
  assert.match(layout, /url: "\/"/);
  assert.doesNotMatch(layout, /metadataBase: new URL\("https:\/\/www\.crestfall\.net"\)/);
});

test("Studio publishes an explicit Discord/Open Graph card on the new domain", () => {
  const layout = read("app/studio/layout.js");

  assert.match(layout, /export const metadata/);
  assert.match(layout, /canonical: "\/studio"/);
  assert.match(layout, /url: "\/studio"/);
  assert.match(layout, /crestfall-og-v2\.png/);
  assert.match(layout, /width: 1200/);
  assert.match(layout, /height: 630/);
  assert.match(layout, /card: "summary_large_image"/);
});

test("signed-out Studio returns a public-safe 200 presentation instead of redirecting", () => {
  const layout = read("app/studio/layout.js");

  assert.doesNotMatch(layout, /redirect\("\/login"\)/);
  assert.match(layout, /function SignedOutStudioGate/);
  assert.match(layout, /if \(!user\) \{[\s\S]*return <SignedOutStudioGate \/>/);
  assert.match(layout, /href="\/login"/);
  assert.match(layout, /Build worlds that remember\./);
});

test("authenticated Studio keeps the existing application shell and children", () => {
  const layout = read("app/studio/layout.js");

  assert.match(layout, /return <StudioShell user=\{user\}>\{children\}<\/StudioShell>/);
  assert.match(layout, /supabase\.auth\.getUser\(\)/);
});
