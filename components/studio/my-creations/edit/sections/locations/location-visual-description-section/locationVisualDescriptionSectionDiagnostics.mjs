import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Location Visual Description Shell stays thin", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationVisualDescriptionSection.jsx"
  );
  assert.match(shell, /useLocationVisualDescriptionSectionViewModel/);
  assert.match(shell, /LocationVisualDescriptionSectionView/);
  assert.doesNotMatch(shell, /SharedFields/);
  assert.doesNotMatch(shell, /form\.data/);
  assert.doesNotMatch(shell, /updateDataField\?\.\(/);
});

test("Location Visual Description View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-visual-description-section/LocationVisualDescriptionSection.view.jsx"
  );
  assert.match(view, /SectionTitle/);
  assert.match(view, /TextField/);
  assert.match(view, /TextAreaField/);
  assert.match(view, /onChangeArchitecture/);
  assert.match(view, /onChangeDesignNotes/);
  assert.doesNotMatch(view, /form\b/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /spatial_design/);
  assert.doesNotMatch(view, /design_reference/);
});

test("Location Visual Description ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-visual-description-section/useLocationVisualDescriptionSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeLocationVisualDescriptionData/);
  assert.match(viewModel, /source\.layout \|\| source\.spatial_design/);
  assert.match(viewModel, /source\.design_notes \|\| source\.design_reference/);
  assert.match(viewModel, /updateDataField\?\.\("visual_motifs"/);
  assert.match(viewModel, /updateDataField\?\.\("layout"/);
  assert.match(viewModel, /updateDataField\?\.\("design_notes"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Visual Description contract and fixtures cover current and legacy states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-visual-description-section/LocationVisualDescriptionSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-visual-description-section/LocationVisualDescriptionSection.fixtures.js"
  );
  assert.match(contract, /LOCATION_VISUAL_DESCRIPTION_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /legacyReadFields/);
  assert.match(contract, /spatial_design/);
  assert.match(contract, /design_reference/);
  assert.match(fixtures, /locationVisualDescriptionCompleteFixture/);
  assert.match(fixtures, /locationVisualDescriptionLegacyFixture/);
  assert.match(fixtures, /locationVisualDescriptionSparseFixture/);
  assert.match(fixtures, /locationVisualDescriptionEmptyFixture/);
});

test("Location Visual Description preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/location-visual-description-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/location-visual-description-section/LocationVisualDescriptionSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationVisualDescriptionSectionView/);
  assert.match(preview, /Legacy Fallbacks/);
});

test("Creation Edit retains the public Location Visual Description Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import LocationVisualDescriptionSection from/);
  assert.match(editShell, /<LocationVisualDescriptionSection/);
  assert.match(editShell, /updateDataField=\{updateDataField\}/);
});

test("Location Visual Description package documents payload and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-visual-description-section/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /spatial_design/);
  assert.match(readme, /design_reference/);
  assert.match(readme, /\/dev\/ui-preview\/location-visual-description-section/);
  assert.match(packageJson, /diagnostics:loom:location-visual-description-section/);
});
