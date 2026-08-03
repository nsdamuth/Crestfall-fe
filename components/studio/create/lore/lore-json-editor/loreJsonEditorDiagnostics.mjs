import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("JSON Editor shell remains thin", () => {
  const shell = read("components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.jsx");
  assert.match(shell, /useLoreJsonEditorViewModel/);
  assert.match(shell, /LoreJsonEditorModalView/);
  assert.ok(shell.split("\n").length < 20);
});

test("JSON ViewModel owns round-trip operations", () => {
  const viewModel = read("components/studio/create/lore/lore-json-editor/useLoreJsonEditorViewModel.js");
  for (const token of ["formatLoreJsonData", "validateLoreJsonText", "navigator.clipboard", "buildLoreJsonAiAuthoringGuide", "onApply"]) {
    assert.match(viewModel, new RegExp(token.replace(".", "\\.")));
  }
});

test("portable JSON View has no persistence ownership", () => {
  const view = read("components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.view.jsx");
  assert.match(view, /onValidateAndApply/);
  assert.match(view, /onDownloadAiGuide/);
  assert.doesNotMatch(view, /@\/lib\/client|next\/navigation|Supabase|PostGraphile/);
});

test("fixtures README and protected preview exist", () => {
  const fixtures = read("components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.fixtures.js");
  const readme = read("components/studio/create/lore/lore-json-editor/README.md");
  const page = read("app/dev/ui-preview/lore-json-editor/page.jsx");
  const preview = read("app/dev/ui-preview/lore-json-editor/LoreJsonEditorPreviewClient.jsx");
  assert.match(fixtures, /loreJsonEditorFixture/);
  assert.match(readme, /Lore JSON Editor LOOM Package/);
  assert.match(page, /NODE_ENV === "production"/);
  assert.match(preview, /LoreJsonEditorModalView/);
  assert.doesNotMatch(preview, /@\/lib\/client/);
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:lore-json-editor/);
});
