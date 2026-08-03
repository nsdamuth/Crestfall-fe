import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Lore Builder keeps a thin Binding Shell with application-owned injection", () => {
  const shell = read("components/studio/create/lore/LoreBuilderShell.jsx");
  assert.match(shell, /useLoreBuilderViewModel/);
  assert.match(shell, /LoreJsonEditorModal/);
  assert.match(shell, /CreationShareButton/);
  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.doesNotMatch(shell, /createLoreDraft|<input|<textarea/);
});

test("Lore Builder View stays portable and composes portable child Views", () => {
  const view = read("components/studio/create/lore/lore-builder/LoreBuilder.view.jsx");
  assert.match(view, /LoreEditorView/);
  assert.match(view, /LoreDocumentRendererView/);
  assert.match(view, /LinkComponent = "a"/);
  assert.doesNotMatch(view, /next\/navigation|next\/link|@\/lib\/client|Supabase|PostGraphile/);
});

test("Lore Builder ViewModel owns save and route projection", () => {
  const viewModel = read("components/studio/create/lore/lore-builder/useLoreBuilderViewModel.js");
  assert.match(viewModel, /createLoreDraft/);
  assert.match(viewModel, /router\.replace/);
  assert.match(viewModel, /LORE_BUILDER/);
  assert.match(viewModel, /lore_document/);
});

test("fixtures README and protected preview exist", () => {
  const fixtures = read("components/studio/create/lore/lore-builder/LoreBuilder.fixtures.js");
  const readme = read("components/studio/create/lore/lore-builder/README.md");
  const page = read("app/dev/ui-preview/lore-builder/page.jsx");
  const preview = read("app/dev/ui-preview/lore-builder/LoreBuilderPreviewClient.jsx");
  assert.match(fixtures, /loreBuilderFixture/);
  assert.match(readme, /Lore Builder LOOM Package/);
  assert.match(page, /NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LoreBuilderView/);
  assert.doesNotMatch(preview, /@\/lib\/client/);
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:lore-builder/);
});
