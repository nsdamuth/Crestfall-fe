import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const featureDir = path.dirname(currentFile);
const repoRoot = path.resolve(featureDir, "../../../../..");
const readFeature = (name) => fs.readFileSync(path.join(featureDir, name), "utf8");
const readRepo = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");

test("linked Creation picker View remains application-free", () => {
  const view = readFeature("RegistryLinkedCreationPickerModal.view.jsx");
  assert.match(view, /onChooseCreation/);
  assert.match(view, /creation\?\.id/);
  assert.doesNotMatch(view, /fetchOwnedCreations|createLinkedCreationReferenceKey|registryEntryId|useEffect/);
});

test("linked Creation picker ViewModel owns precise Registry-entry selection", () => {
  const vm = readFeature("useRegistryLinkedCreationPickerViewModel.js");
  for (const token of ["createLinkedCreationReferenceKey","isStructuredRegistryType","createPickerSelections","selectionMode","REGISTRY_ENTRY","WHOLE_CREATION","excludedReferenceKeys","selectedReferenceKeys","registryEntry","selectionId"]) assert.match(vm, new RegExp(token));
});

test("picker shell remains a thin ViewModel/View binding", () => {
  const shell = readRepo("components/studio/create/structured-registry/RegistryLinkedCreationPickerModal.jsx");
  assert.match(shell, /useRegistryLinkedCreationPickerViewModel/);
  assert.match(shell, /<RegistryLinkedCreationPickerModalView/);
  assert.doesNotMatch(shell, /fetchOwnedCreations|createPickerSelections/);
});
