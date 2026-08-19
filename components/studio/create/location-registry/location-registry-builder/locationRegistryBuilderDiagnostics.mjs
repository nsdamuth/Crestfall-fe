import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const featureDir = path.dirname(currentFile);
const repoRoot = path.resolve(featureDir, "../../../../..");

function readFeature(name) {
  return fs.readFileSync(path.join(featureDir, name), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Location Registry Builder Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/create/location-registry/LocationRegistryBuilder.jsx"
  );

  assert.match(shell, /useLocationRegistryBuilderViewModel/);
  assert.match(shell, /<LocationRegistryBuilderView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /createCreationDraft|fetchOwnedCreations|useRouter/);
});

test("Location Registry Builder View is API and persistence free", () => {
  const view = readFeature("LocationRegistryBuilder.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(/);
  assert.doesNotMatch(
    view,
    /supabase|PostGraphile|createCreationDraft|updateCreationDraft|useRouter/
  );
  assert.doesNotMatch(view, /useLocationRegistryBuilder/);
  assert.doesNotMatch(view, /locationRegistryUtils/);
  assert.doesNotMatch(view, /getDistanceModeDisplay/);
  assert.match(view, /connection\.distanceModeDisplay/);
  assert.match(view, /characterOptions/);
  assert.match(view, /characterLoadError/);
  assert.match(view, /onApplyCharacter/);
  assert.match(view, /selectedCharacterId/);
  assert.match(view, /selectedNpcEntryId/);
  assert.match(view, /disabledCharacterIds/);
  assert.match(view, /disabledNpcEntryIds/);
  assert.match(view, /Character selection required/);
  assert.match(view, /Legacy NPC Registry reference unavailable/);
  assert.match(view, /NPC Registry entry unavailable/);
  assert.match(view, /Linked Character unavailable/);
  assert.match(view, /crossRegistry = \{\}/);
  assert.match(view, /onSelectConnectionEndpointRegistry/);
  assert.match(view, /onSelectConnectionEndpointLocation/);
  assert.match(view, /label="From Registry"/);
  assert.match(view, /label="To Registry"/);
  assert.match(view, /blankLabel="This Registry"/);
  assert.match(view, /connection\.fromLocationDisplay/);
  assert.match(view, /connection\.toLocationDisplay/);
  assert.match(view, /Cross-Registry Boundary: yes/);
  assert.match(view, /Save this Location Registry before authoring cross-Registry/);
  assert.match(view, /reference identity is preserved/);
  assert.match(view, /splitPreview = \{\}/);
  assert.match(view, /onOpenSplitPreview/);
  assert.match(view, /onToggleSplitCandidate/);
  assert.match(view, /onPrepareSplitPlan/);
  assert.match(view, /onChangeSplitCreatorConfirmation/);
  assert.match(view, /onCommitSplitPlan/);
  assert.match(view, /Analyze Split/);
  assert.match(view, /Split Registry Preview/);
  assert.match(view, /Source integrity issues must be corrected before any split can proceed/);
  assert.match(view, /Select for server validation/);
  assert.match(view, /Validate Selected Split/);
  assert.match(view, /Refresh Server Plan/);
  assert.match(view, /Confirm & Execute Split/);
  assert.match(view, /Applying Atomic Split/);
});

test("Location Registry Builder ViewModel owns the wired application foundation", () => {
  const viewModel = readFeature("useLocationRegistryBuilderViewModel.js");

  assert.match(viewModel, /useLocationRegistryBuilder/);
  assert.match(viewModel, /analyzeLocationRegistrySplit/);
  assert.match(viewModel, /planLocationRegistrySplit/);
  assert.match(viewModel, /commitLocationRegistrySplit/);
  assert.match(viewModel, /currentCreationId/);
  assert.match(viewModel, /withEntryPresentation/);
  assert.match(viewModel, /withEntryListPresentation/);
  assert.match(viewModel, /withConnectionPresentation/);
  assert.match(viewModel, /withConnectionListCrossRegistryPresentation/);
  assert.match(viewModel, /withPresencePresentation/);
  assert.match(viewModel, /characterOptions/);
  assert.match(viewModel, /registryOptions/);
  assert.match(viewModel, /crossRegistry/);
  assert.match(viewModel, /splitPreview/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Registry Builder contract and fixtures cover core states", () => {
  const contract = readFeature("LocationRegistryBuilder.contract.js");
  const fixtures = readFeature("LocationRegistryBuilder.fixtures.js");

  assert.match(contract, /location-registry-builder\.view\.v1/);
  assert.match(contract, /connections/);
  assert.match(contract, /presence/);
  assert.match(contract, /weather/);
  assert.match(fixtures, /locationRegistryBuilderEntriesFixture/);
  assert.match(fixtures, /locationRegistryBuilderConnectionsFixture/);
  assert.match(fixtures, /locationRegistryBuilderPresenceFixture/);
  assert.match(fixtures, /locationRegistryBuilderPresenceDirectCharacterFixture/);
  assert.match(fixtures, /locationRegistryBuilderPresenceUnavailableFixture/);
  assert.match(fixtures, /locationRegistryBuilderCrossRegistryConnectionFixture/);
  assert.match(fixtures, /locationRegistryBuilderCrossRegistryDegradedFixture/);
  assert.match(fixtures, /locationRegistryBuilderSplitPreviewFixture/);
  assert.match(fixtures, /locationRegistryBuilderSplitBlockedFixture/);
  assert.match(fixtures, /locationRegistryBuilderSplitCommitReadyFixture/);
  assert.match(fixtures, /locationRegistryBuilderEditFixture/);
});

test("Location Registry shared application modules expose split, presence, hierarchy, and cross-registry foundations", () => {
  const utils = readRepo("components/studio/registries/locationRegistryUtils.js");
  const hook = readRepo("components/studio/registries/hooks/useLocationRegistryBuilder.js");
  const registryClient = readRepo("lib/client/studio/registries/registryClient.js");
  const splitClient = readRepo("lib/client/studio/registries/locationRegistrySplitClient.js");
  const splitAnalysis = readRepo("components/studio/registries/locationRegistrySplitAnalysis.mjs");
  const endpointSelection = readRepo("components/studio/registries/locationRegistryConnectionEndpointSelection.mjs");

  assert.match(utils, /LOCATION_REGISTRY_VERSION = "1\.4"/);
  assert.match(utils, /LOCATION_REGISTRY_HIERARCHY_CONTRACT_VERSION/);
  assert.match(utils, /LOCATION_REGISTRY_CROSS_REGISTRY_LOCATION_CONTRACT_VERSION/);
  assert.match(utils, /normalizeLocationRegistryCharacterOptions/);
  assert.match(utils, /hydrateLocationRegistryPresenceBindings/);
  assert.match(utils, /normalizeLocationConnectionEndpoint/);
  assert.match(hook, /fetchLocationRegistryCharacterOptions/);
  assert.match(hook, /fetchLocationRegistryRegistryOptions/);
  assert.match(hook, /fetchLocationRegistryById/);
  assert.match(hook, /resolveLocationConnectionEndpointSelection/);
  assert.match(registryClient, /fetchLocationRegistryCharacterOptions/);
  assert.match(registryClient, /fetchLocationRegistryRegistryOptions/);
  assert.match(splitClient, /planLocationRegistrySplit/);
  assert.match(splitClient, /commitLocationRegistrySplit/);
  assert.match(splitAnalysis, /analyzeLocationRegistrySplit/);
  assert.match(endpointSelection, /resolveLocationConnectionEndpointSelection/);
});

test("Location Registry Builder preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/location-registry-builder/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/location-registry-builder/LocationRegistryBuilderPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationRegistryBuilderView/);
  assert.doesNotMatch(preview, /createCreationDraft|fetch\s*\(/);
});

test("Location Registry create route retains the public Shell", () => {
  const page = readRepo("app/studio/create/location-registry/page.jsx");
  assert.match(page, /LocationRegistryBuilder/);
});

test("Creation Edit retains controlled Location Registry mode", () => {
  const editSection = readRepo(
    "components/studio/my-creations/edit/sections/location-registries/LocationRegistryFieldsSection.jsx"
  );

  assert.match(editSection, /mode="edit"/);
  assert.match(editSection, /activeTab=/);
  assert.match(editSection, /hideTabs/);
  assert.match(editSection, /onChange=/);
});
