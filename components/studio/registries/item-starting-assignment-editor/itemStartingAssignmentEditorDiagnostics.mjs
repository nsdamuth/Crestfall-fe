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

test("Item Starting Assignment Editor shell stays thin and owns the picker slot", () => {
  const shell = read(
    "components/studio/registries/ItemStartingAssignmentEditor.jsx"
  );
  assert.match(shell, /useItemStartingAssignmentEditorViewModel/);
  assert.match(shell, /ItemStartingAssignmentEditorView/);
  assert.match(shell, /RegistryLinkedCreationPickerModal/);
  assert.match(shell, /pickerSlot/);
  assert.doesNotMatch(
    shell,
    /normalizeItemStartingAssignment|normalizeItemPlacement|createEmptyItemPlacementStep/
  );
});

test("ViewModel owns assignment normalization and semantic mutations", () => {
  const viewModel = read(
    "components/studio/registries/item-starting-assignment-editor/useItemStartingAssignmentEditorViewModel.js"
  );
  for (const token of [
    "normalizeItemStartingAssignment",
    "normalizeItemPlacement",
    "createEmptyItemPlacement",
    "createEmptyItemPlacementStep",
    "itemStartingHolderUsesCreation",
    "HOLDER_PICKER_CONFIG",
    "moveArrayEntry",
    "changeHolderType",
    "selectCreation",
    "updatePlacementStep",
    "addPlacementStep",
    "placementNote",
  ]) {
    assert.match(viewModel, new RegExp(token));
  }
  assert.doesNotMatch(viewModel, /<RegistryLinkedCreationPickerModal|<\w+/);
});

test("Portable View is application-picker, registry-normalization, and transport free", () => {
  const view = read(
    "components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.view.jsx"
  );
  assert.match(view, /pickerSlot/);
  assert.match(view, /CrestfallSelect/);
  assert.doesNotMatch(view, /RegistryLinkedCreationPickerModal/);
  assert.doesNotMatch(
    view,
    /itemRegistryUtils|normalizeItemStartingAssignment|normalizeItemPlacement/
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
});

test("Contract and fixtures cover current and legacy assignment shapes", () => {
  const contract = read(
    "components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.contract.js"
  );
  const fixtures = read(
    "components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.fixtures.js"
  );
  assert.match(contract, /ITEM_STARTING_ASSIGNMENT_EDITOR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /placementSteps/);
  assert.match(contract, /pickerSlot/);
  assert.match(fixtures, /itemStartingAssignmentUnassignedFixture/);
  assert.match(fixtures, /itemStartingAssignmentStoryFixture/);
  assert.match(fixtures, /itemStartingAssignmentCharacterFixture/);
  assert.match(fixtures, /itemStartingAssignmentLegacyFixture/);
  assert.match(fixtures, /holder_creation_id/);
  assert.match(fixtures, /placement_path/);
});

test("Preview is development-only and uses a local fixture picker", () => {
  const page = read(
    "app/dev/ui-preview/item-starting-assignment-editor/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/item-starting-assignment-editor/ItemStartingAssignmentEditorPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /useItemStartingAssignmentEditorViewModel/);
  assert.match(preview, /Preview Holder Picker/);
  assert.doesNotMatch(preview, /RegistryLinkedCreationPickerModal/);
});

test("Item Registry Create retains the public editor shell", () => {
  const builder = read(
    "components/studio/create/item-registry/ItemRegistryBuilder.jsx"
  );
  assert.match(builder, /import ItemStartingAssignmentEditor from/);
  assert.match(builder, /<ItemStartingAssignmentEditor/);
  assert.match(builder, /startingAssignmentContentByEntryId/);
});

test("Creation Edit retains the public editor shell", () => {
  const fields = read(
    "components/studio/my-creations/edit/sections/item-registries/ItemRegistryFieldsSection.jsx"
  );
  assert.match(fields, /import ItemStartingAssignmentEditor from/);
  assert.match(fields, /<ItemStartingAssignmentEditor/);
  assert.match(fields, /updateEntryStartingAssignment/);
});

test("Package script and README document the focused LOOM boundary", () => {
  const packageJson = read("package.json");
  const readme = read(
    "components/studio/registries/item-starting-assignment-editor/README.md"
  );
  assert.match(packageJson, /diagnostics:loom:item-starting-assignment-editor/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /placementNote/);
  assert.match(readme, /\/dev\/ui-preview\/item-starting-assignment-editor/);
});
