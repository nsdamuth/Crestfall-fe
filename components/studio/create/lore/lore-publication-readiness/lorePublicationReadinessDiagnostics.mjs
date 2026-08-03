import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Publication Readiness shell owns Next.js navigation", () => {
  const shell = read("components/studio/create/lore/LorePublicationReadiness.jsx");
  assert.match(shell, /import Link from "next\/link"/);
  assert.match(shell, /useLorePublicationReadinessViewModel/);
  assert.match(shell, /LinkComponent=\{Link\}/);
});

test("ViewModel owns validation publication polling and dirty guards", () => {
  const viewModel = read("components/studio/create/lore/lore-publication-readiness/useLorePublicationReadinessViewModel.js");
  for (const token of ["fetchLoreValidationState", "submitLoreValidation", "cancelLoreValidation", "publishLoreValidatedRevision", "hasUnsavedChanges"]) {
    assert.match(viewModel, new RegExp(token));
  }
});

test("portable readiness View only invokes semantic operations", () => {
  const view = read("components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view.jsx");
  assert.match(view, /LinkComponent = "a"/);
  assert.match(view, /Submit for validation/);
  assert.match(view, /Publish validated revision/);
  assert.doesNotMatch(view, /@\/lib\/client|next\/link|next\/navigation|Supabase|PostGraphile/);
});

test("fixtures README and protected preview exist", () => {
  const fixtures = read("components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.fixtures.js");
  const readme = read("components/studio/create/lore/lore-publication-readiness/README.md");
  const page = read("app/dev/ui-preview/lore-publication-readiness/page.jsx");
  const preview = read("app/dev/ui-preview/lore-publication-readiness/LorePublicationReadinessPreviewClient.jsx");
  assert.match(fixtures, /lorePublicationReadinessFixture/);
  assert.match(readme, /Lore Publication Readiness LOOM Package/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LorePublicationReadinessView/);
  assert.doesNotMatch(preview, /@\/lib\/client/);
});

test("package script is registered", () => {
  assert.match(read("package.json"), /diagnostics:loom:lore-publication-readiness/);
});
