import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Creation Overview Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/OverviewSection.jsx"
  );
  assert.match(shell, /useCreationOverviewSectionViewModel/);
  assert.match(shell, /<CreationOverviewSectionView/);
  assert.doesNotMatch(shell, /updateField\(|form\?\.|form\./);
});

test("Creation Overview View is API, persistence, and storage-key free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateField|form\?\.|form\.|updateDataField/);
});

test("Creation Overview ViewModel owns top-level field mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/creation-overview-section/useCreationOverviewSectionViewModel.js"
  );
  assert.match(viewModel, /updateField\?\.\("title", value\)/);
  assert.match(viewModel, /updateField\?\.\("description", value\)/);
  assert.match(viewModel, /form\?\.title/);
  assert.match(viewModel, /form\?\.description/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Creation Overview contract and fixtures cover key visual states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.fixtures.js"
  );
  assert.match(contract, /CREATION_OVERVIEW_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /onChangeTitle/);
  assert.match(contract, /onChangeDescription/);
  assert.match(fixtures, /creationOverviewSectionPopulatedFixture/);
  assert.match(fixtures, /creationOverviewSectionEmptyFixture/);
  assert.match(fixtures, /creationOverviewSectionLongContentFixture/);
  assert.match(fixtures, /creationOverviewSectionMissingCallbacksFixture/);
});

test("Creation Overview preview is development-only", () => {
  const page = read("app/dev/ui-preview/creation-overview-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-overview-section/CreationOverviewSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CreationOverviewSectionView/);
});

test("Creation Edit retains the public Creation Overview Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import OverviewSection from/);
  assert.match(editShell, /<OverviewSection form=\{form\} updateField=\{updateField\}/);
});

test("Creation Overview package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/creation-overview-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /top-level creation title and description/);
  assert.match(readme, /\/dev\/ui-preview\/creation-overview-section/);
});
