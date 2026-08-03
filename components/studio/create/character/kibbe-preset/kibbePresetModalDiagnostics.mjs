import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Kibbe Preset shell composes ViewModel and View", () => {
  const shell = read("components/studio/create/character/KibbePresetModal.jsx");
  assert.match(shell, /useKibbePresetModalViewModel/);
  assert.match(shell, /KibbePresetModalView/);
});

test("ViewModel preserves three explicit commit modes", () => {
  const viewModel = read("components/studio/create/character/kibbe-preset/useKibbePresetModalViewModel.js");
  assert.match(viewModel, /onSaveIdentityOnly/);
  assert.match(viewModel, /onFillEmptyFields/);
  assert.match(viewModel, /onReplaceBodyTraits/);
});

test("portable View stays persistence-free", () => {
  const view = read("components/studio/create/character/kibbe-preset/KibbePresetModal.view.jsx");
  assert.match(view, /Save Identity Only/);
  assert.match(view, /Fill Empty Fields/);
  assert.match(view, /Replace Body Traits/);
  assert.doesNotMatch(view, /@\/lib\/client|next\/navigation|Supabase|PostGraphile/);
});

test("fixtures README and protected preview are complete", () => {
  const fixtures = read("components/studio/create/character/kibbe-preset/KibbePresetModal.fixtures.js");
  const readme = read("components/studio/create/character/kibbe-preset/README.md");
  const page = read("app/dev/ui-preview/kibbe-preset/page.jsx");
  assert.match(fixtures, /kibbePresetModalOpenFixture/);
  assert.match(readme, /Kibbe Preset Modal LOOM Package/);
  assert.match(page, /NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:kibbe-preset/);
});
