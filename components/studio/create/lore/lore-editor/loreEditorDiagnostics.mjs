import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Lore Editor Binding Shell owns the JSON modal", () => {
  const shell = read("components/studio/create/lore/LoreEditor.jsx");
  assert.match(shell, /LoreJsonEditorModal/);
  assert.match(shell, /jsonEditorSlot/);
  assert.match(shell, /useLoreEditorViewModel/);
});

test("portable Lore Editor View receives an injected JSON slot", () => {
  const view = read("components/studio/create/lore/lore-editor/LoreEditor.view.jsx");
  assert.match(view, /jsonEditorSlot = null/);
  assert.match(view, /\{jsonEditorSlot\}/);
  assert.doesNotMatch(view, /LoreJsonEditorModal|@\/lib\/client|next\/navigation|next\/link/);
});

test("Lore Editor ViewModel retains normalization validation and reference ownership", () => {
  const viewModel = read("components/studio/create/lore/lore-editor/useLoreEditorViewModel.js");
  for (const token of ["normalizeLoreDocument", "validateLoreDocument", "fetchOwnedCreations", "fetchCommunityCreations", "fetchCreationImageLibrary"]) {
    assert.match(viewModel, new RegExp(token));
  }
  assert.match(viewModel, /lore_document_contract_v4|LORE_DOCUMENT_CONTRACT_VERSION/);
});

test("fixtures README and protected preview exist", () => {
  const fixtures = read("components/studio/create/lore/lore-editor/LoreEditor.fixtures.js");
  const readme = read("components/studio/create/lore/lore-editor/README.md");
  const page = read("app/dev/ui-preview/lore-editor/page.jsx");
  const preview = read("app/dev/ui-preview/lore-editor/LoreEditorPreviewClient.jsx");
  assert.match(fixtures, /loreEditorFixture/);
  assert.match(fixtures, /loreDocumentFixture/);
  assert.match(readme, /Lore Editor LOOM Package/);
  assert.match(page, /NODE_ENV === "production"/);
  assert.match(preview, /LoreEditorView/);
  assert.doesNotMatch(preview, /@\/lib\/client/);
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:lore-editor/);
});
