import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION } from "./KitStudioFilterBar.contract.js";
import { useKitStudioFilterBarViewModel } from "./useKitStudioFilterBarViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

// Minimal, alias-free stand-ins for the fixtures (KitStudioFilterBar.
// fixtures.js pulls in "@/lib/shared/presentation/terminology", which
// only a bundler resolves; a plain `node --test` run cannot, so this
// file exercises the ViewModel directly instead of importing it).

// ASSET-FOLDERS package AF2: controlsSlot, additive on top of 2.3.1.
test("the contract bumped to 2.4.0", () => {
  assert.equal(KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION, "2.4.0");
});

test("controlsSlot defaults to null; an absent slot changes nothing an existing consumer passes", () => {
  const vm = useKitStudioFilterBarViewModel({ searchPlaceholder: "Search" });
  assert.equal(vm.controlsSlot, null);
});

test("the ViewModel passes a supplied controlsSlot through unchanged", () => {
  const slot = "a caller-supplied control node";
  const vm = useKitStudioFilterBarViewModel({ searchPlaceholder: "Search", controlsSlot: slot });
  assert.equal(vm.controlsSlot, slot);
});

test("the View renders controlsSlot after Sort and before viewModeSlot, on the same sideways scroller", () => {
  const view = read("KitStudioFilterBar.view.jsx");
  assert.match(view, /overflow-x-auto/);
  const sortAt = view.indexOf('label="Sort"');
  const controlsSlotAt = view.indexOf("{controlsSlot}");
  const viewModeSlotAt = view.indexOf("{viewModeSlot}");
  assert.ok(sortAt > -1 && sortAt < controlsSlotAt, "controlsSlot must render after Sort");
  assert.ok(controlsSlotAt < viewModeSlotAt, "controlsSlot must render before viewModeSlot");
  // Both controlsSlot and viewModeSlot sit inside the one
  // overflow-x-auto container that opens before either of them.
  const scrollerAt = view.indexOf("overflow-x-auto");
  assert.ok(scrollerAt > -1 && scrollerAt < controlsSlotAt && scrollerAt < viewModeSlotAt);
});

test("the View applies no sizing wrapper around a slotted control", () => {
  const view = read("KitStudioFilterBar.view.jsx");
  const controlsSlotBlock = view.slice(view.indexOf("{controlsSlot &&"), view.indexOf("{controlsSlot}") + 20);
  assert.doesNotMatch(controlsSlotBlock, /h-\[|w-\[|max-h-|max-w-/);
});
