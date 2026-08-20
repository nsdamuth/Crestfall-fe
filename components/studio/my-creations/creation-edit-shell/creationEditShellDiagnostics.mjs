import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Creation Edit Binding Shell stays thin and injects application owners", () => {
  const shellPath =
    "components/studio/my-creations/CreationEditShell.jsx";
  const shell = read(shellPath);

  assert.ok(
    shell.split("\n").length < 100,
    "CreationEditShell should remain a thin Binding Shell"
  );
  assert.match(shell, /useCreationEditShellViewModel/);
  assert.match(shell, /CreationEditShellView/);
  assert.match(shell, /CreationEditMediaPanel/);
  assert.match(shell, /CreationFeaturedImagePickerModal/);
  assert.match(shell, /CreationEditStickyActionBar/);
  assert.match(shell, /CreationEditSectionContent/);
  assert.match(shell, /CreationEditMechanicsRuntimeQuickNav/);
  assert.match(shell, /href="\/studio\/my-creations"/);
  assert.doesNotMatch(shell, /updateCreationDraft|setDefaultPlayerCharacter/);
  assert.doesNotMatch(shell, /MechanicsModuleFieldsSection|LoreEditor/);
});

test("Shell Chassis composes the existing edit ViewModel and owns projection", () => {
  const viewModel = read(
    "components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js"
  );

  assert.match(viewModel, /useCreationEditViewModel/);
  assert.match(viewModel, /buildCreationEditTypeFlags/);
  assert.match(viewModel, /resolveCreationEditSections/);
  assert.match(viewModel, /setDefaultPlayerCharacter/);
  assert.match(viewModel, /FEATURED_SLOT_INDEX_BY_KEY/);
  assert.match(viewModel, /updateFeaturedMediaSlot/);
  assert.match(viewModel, /setActiveMediaSlot/);
  assert.match(viewModel, /activeSlotPickerKey/);
  assert.match(viewModel, /isStructuredRegistryType/);
  assert.match(viewModel, /isChatCapableCreationType/);
});

test("existing Creation persistence and featured-media storage remain authoritative", () => {
  const editViewModel = read(
    "components/studio/my-creations/edit/hooks/useCreationEditViewModel.js"
  );

  assert.match(editViewModel, /updateCreationDraft/);
  assert.match(editViewModel, /buildSavePayload/);
  assert.match(editViewModel, /submitCreationReview/);
  assert.match(editViewModel, /moveCreationToInternalEditing/);
  assert.match(editViewModel, /archiveCreation/);
  assert.match(editViewModel, /deleteCreation/);
  assert.match(editViewModel, /featuredMedia/);
  assert.match(editViewModel, /featured_media/);
  assert.match(editViewModel, /imageOutputId/);
  assert.match(editViewModel, /storagePath/);
});

test("application section composition preserves registry dispatch, editors, and legacy aliases", () => {
  const content = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );
  const componentMap = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );

  assert.match(content, /SECTION_COMPONENT_REGISTRY/);
  assert.match(content, /LoreDocumentRenderer/);
  assert.match(content, /LorePublicationReadiness/);

  for (const token of [
    "CharacterTemplateFieldsSection",
    "ItemRegistryFieldsSection",
    "LocationRegistryFieldsSection",
    "VisualReferencesSection",
    "LoreEditor",
    "MechanicsModuleFieldsSection",
    "RuntimeMechanicsModulesSection",
    "ActorMechanicsProfileAttachmentSection",
    "SkillsProfileEditor",
    "AbilitySpellProfileEditor",
    "WalletProfileEditor",
    "rules_codex",
    "rulesCodex",
    "lore_document",
    "loreDocument",
    "actor_mechanics_profile",
    "mechanics_loadout",
    "progression_profile",
    "skills_profile",
    "ability_spell_profile",
    "wallet_profile",
  ]) {
    assert.equal(componentMap.includes(token), true, `component registry missing ${token}`);
  }
});

test("portable View renders frame and slots without Crestfall integrations", () => {
  const view = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx"
  );

  assert.match(view, /Editing Template/);
  assert.match(view, /Untitled Creation/);
  assert.match(view, /Set default PC/i);
  assert.match(view, /activeSections\.map/);
  assert.match(view, /mediaPanel/);
  assert.match(view, /sectionContent/);
  assert.match(view, /stickyActionBar/);
  assert.match(view, /featuredImagePicker/);
  assert.doesNotMatch(view, /next\/link|next\/navigation/);
  assert.doesNotMatch(view, /@\/lib\/client|Supabase|PostGraphile/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection|LoreEditor/);
});

test("existing edit route remains connected to CreationEditShell", () => {
  const candidates = [
    "app/studio/my-creations/[id]/edit/page.jsx",
    "app/studio/my-creations/[id]/edit/page.js",
  ];
  const route = candidates.find((candidate) =>
    fs.existsSync(path.join(repoRoot, candidate))
  );

  assert.ok(route, "Creation edit route should remain present");
  assert.match(read(route), /CreationEditShell/);
});

test("contract fixtures and protected preview are explicit", () => {
  const contract = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditShell.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditShell.fixtures.js"
  );
  const page = read("app/dev/ui-preview/creation-edit-shell/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-edit-shell/CreationEditShellPreviewClient.jsx"
  );

  assert.match(contract, /CREATION_EDIT_SHELL_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CreationEditShellViewProps/);
  assert.match(fixtures, /playerCharacter/);
  assert.match(fixtures, /lore/);
  assert.match(fixtures, /mechanicsModule/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CreationEditShellView/);
  assert.match(preview, /No Creation is loaded or persisted/);
});

test("candidate assessment documentation and command remain discoverable", () => {
  const readme = read(
    "components/studio/my-creations/creation-edit-shell/README.md"
  );
  const packageJson = read("package.json");
  const templateReadme = read(
    "components/studio/create/character-template/character-template-builder/README.md"
  );
  const activePicker = read(
    "components/studio/my-creations/image-library/CreationReferenceImagePickerModal.jsx"
  );

  assert.match(readme, /CharacterTemplateBuilderEditor/);
  assert.match(readme, /creation-reference-image-picker/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/creation-edit-shell/);
  assert.match(templateReadme, /application-owned composition/);
  assert.match(activePicker, /useCreationReferenceImagePickerViewModel/);
  assert.match(packageJson, /diagnostics:loom:creation-edit-shell/);
});
