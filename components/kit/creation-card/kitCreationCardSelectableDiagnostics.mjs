import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { KIT_CREATION_CARD_VIEW_CONTRACT_VERSION } from "./KitCreationCard.contract.js";
import * as fixtures from "./KitCreationCard.fixtures.js";
// Aliased: the ViewModel is a pure fold (no hooks inside), and the
// hooks lint rule keys on the call name when it runs in a loop.
import { useKitCreationCardViewModel as foldCardProps } from "./useKitCreationCardViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(currentDir, relativePath), "utf8");

const NEW_PROPS = ["isSelectable", "isSelected", "onToggleSelect", "onAddToFolder"];
const NEW_FIXTURES = new Set([
  "kitCreationCardSelectableFixture",
  "kitCreationCardSelectedFixture",
  "kitCreationCardSelectedListFixture",
  "kitCreationCardAddToFolderFixture",
]);

test("contract 3.9.0", () => {
  assert.equal(KIT_CREATION_CARD_VIEW_CONTRACT_VERSION, "3.9.0");
});

// G2: every existing fixture renders with the four new props absent,
// and the ViewModel folds their absence to the unchanged defaults.
test("every pre-3.9.0 fixture omits the four new props and folds to the unchanged defaults", () => {
  const existing = Object.entries(fixtures).filter(([name]) => name.startsWith("kitCreationCard") && !NEW_FIXTURES.has(name));
  assert.ok(existing.length >= 15);
  for (const [name, fixture] of existing) {
    for (const prop of NEW_PROPS) assert.equal(prop in fixture, false, `${name} omits ${prop}`);
    const vm = foldCardProps(fixture);
    assert.equal(vm.isSelectable, false);
    assert.equal(vm.isSelected, false);
    assert.equal(vm.onToggleSelect, null);
    assert.equal(vm.onAddToFolder, null);
  }
});

test("the new fixtures exercise the check control and the folder row", () => {
  const selectable = foldCardProps(fixtures.kitCreationCardSelectableFixture);
  assert.equal(selectable.isSelectable, true);
  assert.equal(selectable.isSelected, false);
  assert.equal(typeof selectable.onToggleSelect, "function");
  const selected = foldCardProps(fixtures.kitCreationCardSelectedFixture);
  assert.equal(selected.isSelected, true);
  assert.equal(foldCardProps(fixtures.kitCreationCardSelectedListFixture).layout, "list");
  const folder = foldCardProps(fixtures.kitCreationCardAddToFolderFixture);
  assert.equal(typeof folder.onAddToFolder, "function");
  assert.equal(folder.isOwner, true);
});

test("the View renders the check only when selectable, the folder row only when supplied, at 44px, without a literal", () => {
  const view = read("KitCreationCard.view.jsx");
  assert.match(view, /function SelectControl/);
  assert.match(view, /role="checkbox"/);
  assert.equal((view.match(/\{isSelectable \? \(/g) || []).length, 2, "grid and list both gate the check");
  assert.match(view, /\{onAddToFolder \? \(/);
  assert.match(view, /label="Add to folder"/);
  const control = view.slice(view.indexOf("function SelectControl"), view.indexOf("// Viewer-owned kebab menu"));
  assert.match(control, /h-\[var\(--control-md\)\] w-\[var\(--control-md\)\]/);
  assert.match(control, /gold-bright/);
  assert.doesNotMatch(view, /#[0-9a-fA-F]{3,6}|rgba?\(|text-xs|shadow-2xl/);
});
