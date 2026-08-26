import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("renderer Binding Shell owns navigation and sharing integration", () => {
  const shell = read("components/studio/create/lore/LoreDocumentRenderer.jsx");
  assert.match(shell, /import Link from "next\/link"/);
  assert.match(shell, /CreationShareButton/);
  assert.match(shell, /ShareButtonComponent=\{CreationShareButton\}/);
});

test("portable renderer uses injected navigation and share controls", () => {
  const view = read("components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx");
  assert.match(view, /LinkComponent = "a"/);
  assert.match(view, /ShareButtonComponent = null/);
  assert.match(view, /<ShareButtonComponent/);
  assert.doesNotMatch(view, /CreationShareButton|next\/link|@\/lib\/client/);
});

test("Lore image blocks use Lore-only archival framing rather than changing the shared image system", () => {
  const renderer = read("components/LoreBlockRenderer.jsx");
  const imageBlock = read("components/blocks/ImageBlock.jsx");
  const css = read("app/globals.css");

  assert.match(renderer, /variant="lore-parchment"/);
  assert.match(imageBlock, /variant = "default"/);
  assert.match(imageBlock, /lore-parchment-plate__frame/);
  assert.match(css, /\.lore-parchment-plate__frame/);
  assert.match(css, /\.lore-parchment-plate__caption/);
});

test("renderer preserves immutable public deep-link projection", () => {
  const view = read("components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx");
  assert.match(view, /buildAnchorHref/);
  assert.match(view, /Copy chapter link/);
  assert.match(view, /Copy section link/);
  assert.match(view, /\/studio\/creations\//);
});

test("fixtures README and protected preview exist", () => {
  const fixtures = read("components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.fixtures.js");
  const readme = read("components/studio/create/lore/lore-document-renderer/README.md");
  const page = read("app/dev/ui-preview/lore-document-renderer/page.jsx");
  const preview = read("app/dev/ui-preview/lore-document-renderer/LoreDocumentRendererPreviewClient.jsx");
  assert.match(fixtures, /loreDocumentRendererFixture/);
  assert.match(readme, /Lore Document Renderer LOOM Package/);
  assert.match(readme, /archival image plates/i);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LoreDocumentRendererView/);
  assert.doesNotMatch(preview, /@\/lib\/client/);
});


test("Next Image allows only the known local thumbnail proxy query patterns", () => {
  const config = read("next.config.mjs");

  assert.match(
    config,
    /pathname:\s*["']\/\*\*["'],\s*search:\s*["']["']/s
  );
  assert.match(
    config,
    /pathname:\s*["']\/api\/media\/images\/\*\/file["'],\s*search:\s*["']\?variant=thumbnail["']/s
  );
  assert.match(
    config,
    /pathname:\s*["']\/api\/studio\/image-generation\/outputs\/\*\/file["'],\s*search:\s*["']\?variant=thumbnail["']/s
  );
  assert.equal(
    (config.match(/search:\s*["']\?variant=thumbnail["']/g) || []).length,
    2
  );
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:lore-document-renderer/);
});
