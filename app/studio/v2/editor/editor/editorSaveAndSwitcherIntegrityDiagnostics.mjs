import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("production creation switcher loads live owned summaries instead of mock ids", () => {
  const shell = read("components/studio/creation-picker/CreationPicker.jsx");

  assert.match(shell, /fetchOwnedCreations\(\{ view: "summary" \}\)/);
  assert.match(shell, /resolveCreationBucket/);
  assert.match(shell, /creation\?\.imageUrl/);
  assert.doesNotMatch(shell, /OWNED_CREATIONS_PICKER_MOCK/);
  assert.doesNotMatch(shell, /ownedCreationsPicker\.mock/);
});

test("V2 editor switch routing rejects fixture or malformed ids before navigation and server fetch", () => {
  const editor = read("app/studio/v2/editor/Editor.jsx");
  const loader = read("lib/server/studio/getEditCreationPageData.js");

  assert.match(editor, /normalizeCreationUuid\(nextCreationId\)/);
  assert.match(editor, /if \(!normalizedCreationId\) return;/);
  assert.match(editor, /encodeURIComponent\(normalizedCreationId\)/);
  assert.match(loader, /!UUID_PATTERN\.test\(creationId\)/);
});

test("V2 editor save block consumes accepted lifecycle authority and surfaces Unlist for Editing", () => {
  const viewModel = read("app/studio/v2/editor/editor/useEditorViewModel.js");
  const view = read("app/studio/v2/editor/editor/Editor.view.jsx");

  assert.match(viewModel, /getCreationEditStickyActionBarViewProps/);
  assert.match(viewModel, /canUnlistForEditing/);
  assert.match(viewModel, /editLockMessage/);
  assert.match(viewModel, /onUnlistForEditing/);
  assert.match(view, /Unlist for Editing/);
  assert.match(view, /savePolicy\?\.canUnlistForEditing/);
  assert.match(view, /savePolicy\?\.canSave === false/);
});

test("unlisting a public creation preserves pending local editor fields for the following save", () => {
  const editVm = read(
    "components/studio/my-creations/edit/hooks/useCreationEditViewModel.js"
  );

  assert.match(editVm, /mergeLifecycleTransitionIntoForm/);
  assert.match(editVm, /pending changes are ready to save/);
  assert.match(
    editVm,
    /setForm\(\(current\) =>\s*mergeLifecycleTransitionIntoForm\(current, savedCreation\)/s
  );
});
