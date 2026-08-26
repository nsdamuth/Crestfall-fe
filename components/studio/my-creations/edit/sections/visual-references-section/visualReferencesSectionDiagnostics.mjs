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

test("Visual References Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/VisualReferencesSection.jsx"
  );
  assert.match(shell, /useVisualReferencesSectionViewModel/);
  assert.match(shell, /<VisualReferencesSectionView/);
  assert.match(shell, /<CreationReferenceImagePickerModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Visual References View is API, persistence, and application-feature free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|visual_references|anime_image_output_id|realistic_image_output_id/
  );
  assert.doesNotMatch(view, /CreationReferenceImagePickerModal|useCreationImageLibraryViewModel/);
});

test("Visual References ViewModel owns library normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/visual-references-section/useVisualReferencesSectionViewModel.js"
  );
  assert.match(viewModel, /useCreationImageLibraryViewModel/);
  assert.match(viewModel, /getImageOutputId/);
  assert.match(viewModel, /getDisplayImageUrl/);
  assert.match(viewModel, /visual_references/);
  assert.match(viewModel, /anime_image_output_id/);
  assert.match(viewModel, /realistic_image_output_id/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Visual References contract and fixtures cover portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.fixtures.js"
  );
  assert.match(contract, /VISUAL_REFERENCES_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /referenceCards/);
  assert.match(contract, /pickerModal/);
  assert.match(fixtures, /visualReferencesSectionAssignedFixture/);
  assert.match(fixtures, /visualReferencesSectionEmptyFixture/);
  assert.match(fixtures, /visualReferencesSectionMissingPreviewFixture/);
  assert.match(fixtures, /visualReferencesSectionErrorFixture/);
  assert.match(fixtures, /visualReferencesSectionMissingCallbacksFixture/);
});

test("Visual References preview is development-only", () => {
  const page = read("app/dev/ui-preview/visual-references-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/visual-references-section/VisualReferencesSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /VisualReferencesSectionView/);
});

test("Creation Edit retains the public Visual References Shell through the registry dispatcher", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  const componentMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
  assert.match(editShell, /SECTION_COMPONENT_REGISTRY/);
  assert.match(componentMap, /import VisualReferencesSection from/);
  assert.match(componentMap, /Component: VisualReferencesSection/);
});

test("Visual References package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/visual-references-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /visual_references/);
  assert.match(readme, /\/dev\/ui-preview\/visual-references-section/);
});
