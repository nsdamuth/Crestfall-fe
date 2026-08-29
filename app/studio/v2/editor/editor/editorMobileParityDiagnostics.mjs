import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("mobile editor save actions sit above the Studio dock and expose cancel/save", () => {
  const view = read("app/studio/v2/editor/editor/Editor.view.jsx");

  assert.match(
    view,
    /bottom-\[calc\(var\(--control-md\)\+var\(--space-4\)\+env\(safe-area-inset-bottom\)\)\]/
  );
  assert.match(view, />\s*Cancel\s*</);
  assert.match(view, /onClick=\{\(\) => onDiscard\?\.\(\)\}/);
  assert.match(view, /onClick=\{\(\) => onSave\?\.\(\)\}/);
  assert.match(
    view,
    /pb-\[calc\(var\(--control-md\)\*2\+var\(--space-12\)\+env\(safe-area-inset-bottom\)\)\]/
  );
});

test("character identity prevents mobile min-content overflow", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx"
  );
  const optionModal = read(
    "components/ui/crestfall-option-modal/CrestfallOptionModal.view.jsx"
  );

  assert.match(view, /grid min-w-0 max-w-full gap-4/);
  assert.match(view, /\[&>\*\]:min-w-0/);
  assert.match(view, /break-words/);
  assert.match(optionModal, /min-w-0 max-w-full/);
  assert.match(optionModal, /break-words/);
});

test("character Appearance exposes the default image preset beside clothing through the linked-creation picker", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/AppearanceSection.jsx"
  );
  const view = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx"
  );
  const vm = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/useCharacterAppearanceSectionViewModel.js"
  );
  const identityView = read(
    "components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx"
  );

  assert.match(view, /imagePresetLabel/);
  assert.match(view, /selectedImagePreset/);
  assert.match(view, /xl:grid-cols-2/);
  assert.match(shell, /creationType="IMAGE_PRESET"/);
  assert.match(vm, /fetchOwnedCreations/);
  assert.match(vm, /type: "IMAGE_PRESET"/);
  assert.match(vm, /default_image_preset_id/);
  assert.match(vm, /default_image_preset_title/);
  assert.doesNotMatch(identityView, /defaultImagePresetLabel/);
});

test("notification close control imports its X icon instead of crashing the bell panel", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");

  assert.match(view, /import \{ Bell, Menu, X \} from "lucide-react"/);
  assert.match(view, /<X size=\{14\}/);
});
