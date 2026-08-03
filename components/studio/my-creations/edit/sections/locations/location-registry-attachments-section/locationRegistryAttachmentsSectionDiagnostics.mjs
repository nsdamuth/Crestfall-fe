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

test("Location Registry Attachments Shell stays thin and owns the picker", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection.jsx"
  );
  assert.match(shell, /useLocationRegistryAttachmentsSectionViewModel/);
  assert.match(shell, /LocationRegistryAttachmentsSectionView/);
  assert.match(shell, /RegistryLinkedCreationPickerModal/);
  assert.match(shell, /pickerSlot/);
  assert.doesNotMatch(shell, /form\.data/);
  assert.doesNotMatch(shell, /boundRegistries/);
  assert.doesNotMatch(shell, /createLinkedCreationLink/);
});

test("Location Registry Attachments View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx"
  );
  assert.match(view, /SectionTitle/);
  assert.match(view, /groups\.map/);
  assert.match(view, /onOpenPicker/);
  assert.match(view, /onRemoveRegistry/);
  assert.match(view, /onChangeRegistryNotes/);
  assert.match(view, /\{pickerSlot\}/);
  assert.doesNotMatch(view, /form\b/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /boundRegistries/);
  assert.doesNotMatch(view, /RegistryLinkedCreationPickerModal/);
});

test("Location Registry Attachments ViewModel owns registry definitions and normalization", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/useLocationRegistryAttachmentsSectionViewModel.js"
  );
  assert.match(viewModel, /LOCATION_REGISTRY_GROUPS/);
  assert.match(viewModel, /EVENT_REGISTRY/);
  assert.match(viewModel, /QUEST_REGISTRY/);
  assert.match(viewModel, /NPC_REGISTRY/);
  assert.match(viewModel, /ITEM_REGISTRY/);
  assert.match(viewModel, /LOCATION_REGISTRY/);
  assert.match(viewModel, /FACTION_REGISTRY/);
  assert.match(viewModel, /ORGANIZATION_REGISTRY/);
  assert.match(viewModel, /normalizeLocationBoundRegistries/);
  assert.match(viewModel, /normalizeLocationBoundRegistryLinks/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Registry Attachments ViewModel preserves mirrored writes and legacy IDs", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/useLocationRegistryAttachmentsSectionViewModel.js"
  );
  assert.match(viewModel, /legacy_\$\{registryId\}/);
  assert.match(viewModel, /createLinkedCreationLink/);
  assert.match(viewModel, /dedupeIds/);
  assert.match(viewModel, /updateDataField\?\.\("boundRegistries"/);
  assert.match(viewModel, /updateDataField\?\.\("boundRegistryLinks"/);
  assert.match(viewModel, /existingLinks\.some/);
  assert.match(viewModel, /item\.creationId !== link\.creationId/);
  assert.match(viewModel, /notes \}/);
});

test("Location Registry Attachments contract and fixtures cover supported states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.fixtures.js"
  );
  assert.match(
    contract,
    /LOCATION_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION/
  );
  assert.match(contract, /legacyIdOnlyBindings/);
  assert.match(contract, /mirroredWrites/);
  assert.match(contract, /boundRegistries/);
  assert.match(contract, /boundRegistryLinks/);
  assert.match(fixtures, /locationRegistryAttachmentsCompleteFixture/);
  assert.match(fixtures, /locationRegistryAttachmentsLegacyFixture/);
  assert.match(fixtures, /locationRegistryAttachmentsMixedFixture/);
  assert.match(fixtures, /locationRegistryAttachmentsEmptyFixture/);
});

test("Location Registry Attachments preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/location-registry-attachments-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/location-registry-attachments-section/LocationRegistryAttachmentsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationRegistryAttachmentsSectionView/);
  assert.match(preview, /Legacy ID-Only Binding/);
  assert.match(preview, /Attach Fixture Registry/);
});

test("Shared callers and Location Edit retain one integrated runtime surface", () => {
  const locationBuilderShell = read(
    "components/studio/create/location/LocationBuilderShell.jsx"
  );
  const assetBuilderShell = read(
    "components/studio/create/assets/AssetBuilderShell.jsx"
  );
  const locationRuntimeSection = read(
    "components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection.jsx"
  );
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/README.md"
  );
  const packageJson = read("package.json");

  assert.match(locationBuilderShell, /LocationRegistryAttachmentsSection/);
  assert.match(assetBuilderShell, /LocationRegistryAttachmentsSection/);
  assert.match(
    locationRuntimeSection,
    /import LocationRegistryAttachmentsSection/
  );
  assert.equal(
    (locationRuntimeSection.match(/<LocationRegistryAttachmentsSection/g) || [])
      .length,
    1
  );
  assert.equal(
    (locationRuntimeSection.match(/<RuntimeMechanicsModulesSection/g) || [])
      .length,
    1
  );
  assert.doesNotMatch(locationRuntimeSection, /MechanicsModulePickerModal/);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /legacy ID-only binding projection/);
  assert.match(
    readme,
    /\/dev\/ui-preview\/location-registry-attachments-section/
  );
  assert.match(
    packageJson,
    /diagnostics:loom:location-registry-attachments-section/
  );
});
