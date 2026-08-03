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

test("Location Identity Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationIdentitySection.jsx"
  );
  assert.match(shell, /useLocationIdentitySectionViewModel/);
  assert.match(shell, /<LocationIdentitySectionView/);
  assert.match(shell, /<LocationParentPickerModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\(|useState|parent_location_/);
});

test("Location Identity View is form, persistence, and picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /form\.data|updateDataField|parent_location_/);
  assert.doesNotMatch(view, /LocationParentPickerModal|useState/);
  assert.match(view, /onOpenParentPicker/);
  assert.match(view, /onChangeInheritance/);
});

test("Location Identity ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-identity-section/useLocationIdentitySectionViewModel.js"
  );
  assert.match(viewModel, /normalizeLocationInheritance/);
  assert.match(viewModel, /resolveLocationParentMetadata/);
  assert.match(viewModel, /parent_location_id/);
  assert.match(viewModel, /parseLocationIdentityTags/);
  assert.match(viewModel, /updateDataField\?\.\("parentLocationId"/);
  assert.match(viewModel, /updateDataField\?\.\("inheritance"/);
  assert.match(viewModel, /setIsParentPickerOpen/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Identity contract and fixtures cover hierarchy states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.fixtures.js"
  );
  assert.match(contract, /LOCATION_IDENTITY_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /LocationParentPickerModal/);
  assert.match(contract, /legacyReadFields/);
  assert.match(fixtures, /locationIdentitySelectedParentFixture/);
  assert.match(fixtures, /locationIdentityNoParentFixture/);
  assert.match(fixtures, /locationIdentityInheritanceOverrideFixture/);
  assert.match(fixtures, /locationIdentityFallbackFixture/);
});

test("Location Identity preview is development-only", () => {
  const page = read("app/dev/ui-preview/location-identity-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/location-identity-section/LocationIdentitySectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationIdentitySectionView/);
  assert.match(preview, /Simulate Parent Selection/);
});

test("Creation Edit retains the public Location Identity Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import LocationIdentitySection from/);
  assert.match(editShell, /<LocationIdentitySection/);
  assert.match(editShell, /creationId=\{creationId\}/);
});

test("Location Identity package documents payload and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-identity-section/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /parentLocationId/);
  assert.match(readme, /legacy snake_case/);
  assert.match(readme, /\/dev\/ui-preview\/location-identity-section/);
  assert.match(packageJson, /diagnostics:loom:location-identity-section/);
});
