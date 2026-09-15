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

// ASSET-FOLDERS package AF2: controlsSlot, additive on top of 2.3.1;
// package AF6: leadingSlot, additive on top of 2.4.0.
test("the contract bumped to 2.5.0", () => {
  assert.equal(KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION, "2.5.0");
});

test("controlsSlot and leadingSlot default to null; an absent slot changes nothing an existing consumer passes", () => {
  const vm = useKitStudioFilterBarViewModel({ searchPlaceholder: "Search" });
  assert.equal(vm.controlsSlot, null);
  assert.equal(vm.leadingSlot, null);
});

test("the ViewModel passes a supplied controlsSlot and leadingSlot through unchanged", () => {
  const slot = "a caller-supplied control node";
  const leading = "a caller-supplied leading node";
  const vm = useKitStudioFilterBarViewModel({ searchPlaceholder: "Search", controlsSlot: slot, leadingSlot: leading });
  assert.equal(vm.controlsSlot, slot);
  assert.equal(vm.leadingSlot, leading);
});

// The bar's own controls (quick tabs, Filter, Sort) are one hoisted
// component rendered by both rows, so their order is read through
// its mount rather than through the Sort literal.
function rowBetween(view, startNeedle, endNeedle) {
  const start = view.indexOf(startNeedle);
  const end = view.indexOf(endNeedle, start);
  assert.ok(start > -1 && end > start, `${startNeedle} to ${endNeedle}`);
  return view.slice(start, end);
}

test("without a leading slot the View renders controlsSlot after the bar's own controls and before viewModeSlot, on the same sideways scroller", () => {
  const view = read("KitStudioFilterBar.view.jsx");
  assert.match(view, /overflow-x-auto/);
  const plainRow = rowBetween(view, ") : (\n          <>", "</>\n        )}");
  const groupAt = plainRow.indexOf("{groupControls}");
  const controlsSlotAt = plainRow.indexOf("{controlsSlot}");
  const viewModeSlotAt = plainRow.indexOf("{viewModeSlot}");
  assert.ok(groupAt > -1 && groupAt < controlsSlotAt, "controlsSlot must render after Filter and Sort");
  assert.ok(controlsSlotAt < viewModeSlotAt, "controlsSlot must render before viewModeSlot");
  // The scroller opens before either row.
  const scrollerAt = view.indexOf("overflow-x-auto");
  assert.ok(scrollerAt > -1 && scrollerAt < view.indexOf("{leadingSlot ? ("));
  // The plain row keeps its 2.4.0 structure: the bar's own group only
  // with content, the controlsSlot wrapper only with content, the
  // view toggle at the right edge.
  assert.match(plainRow, /\(quickTabs\.length > 0 \|\| hasGroups \|\| sortOptions\.length > 0\) && \(/);
  assert.match(plainRow, /\{controlsSlot && \(/);
  assert.match(plainRow, /ml-auto flex flex-none items-center">\{viewModeSlot\}/);
});

test("with a leading slot the View renders one row: leadingSlot, then Filter and Sort, controlsSlot, viewModeSlot", () => {
  const view = read("KitStudioFilterBar.view.jsx");
  const leadingRow = rowBetween(view, "{leadingSlot ? (", ") : (\n          <>");
  const order = ["{leadingSlot}", "{groupControls}", "{controlsSlot}", "{viewModeSlot}"].map((needle) => leadingRow.indexOf(needle));
  assert.ok(order.every((index) => index > -1), "every slot renders in the leading row");
  assert.ok(order[0] < order[1] && order[1] < order[2] && order[2] < order[3], "leadingSlot, group, controlsSlot, viewModeSlot in that order");
  // The Media row ruled at AF5 follow-up 2 (items 3 and 5): full
  // width with equal gaps on phones, right-aligned with one gap at
  // 700 and up, inside the same growing wrapper controlsSlot rides.
  assert.match(leadingRow, /flex min-w-0 flex-1 items-center gap-\[var\(--space-2\)\]/);
  assert.match(leadingRow, /flex w-full min-w-0 items-center justify-between gap-\[var\(--space-2\)\] min-\[700px\]:w-auto min-\[700px\]:justify-end min-\[700px\]:gap-\[var\(--space-3\)\]/);
  // The leading slot's render sits above the Filter render in the
  // file (the hoisted controls component is defined after the View).
  assert.ok(view.indexOf("{leadingSlot}") < view.indexOf("<KitFilterPanelView"), "leadingSlot renders before Filter");
  assert.ok(view.indexOf("{leadingSlot}") < view.indexOf("<KitDropdownView"), "leadingSlot renders before the dropdown Filter");
});

test("the View applies no sizing wrapper around a slotted control", () => {
  const view = read("KitStudioFilterBar.view.jsx");
  const controlsSlotAt = view.indexOf("{controlsSlot && (");
  const controlsSlotBlock = view.slice(controlsSlotAt, view.indexOf("{controlsSlot}", controlsSlotAt) + 20);
  assert.doesNotMatch(controlsSlotBlock, /h-\[|w-\[|max-h-|max-w-/);
  const leadingRow = rowBetween(view, "{leadingSlot ? (", ") : (\n          <>");
  assert.doesNotMatch(leadingRow, /h-\[|max-h-|max-w-/);
});
