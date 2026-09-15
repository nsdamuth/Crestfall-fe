import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { KIT_SELECTION_BAR_VIEW_CONTRACT_VERSION } from "./KitSelectionBar.contract.js";
import { kitSelectionBarFixtures } from "./KitSelectionBar.fixtures.js";
import { SELECTION_BAR_COPY, pluralize } from "./selectionBarCopy.js";
import { useKitSelectionBarViewModel } from "./useKitSelectionBarViewModel.js";

// Mounts the ViewModel the way the Binding Shell does, through a real
// React render (react-dom/server, no window), and hands back what it
// returned. The View itself is JSX and stays a source read.
function mountViewModel(props) {
  let viewProps = null;
  function Probe() {
    viewProps = useKitSelectionBarViewModel(props);
    return null;
  }
  renderToString(createElement(Probe));
  return viewProps;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(currentDir, relativePath), "utf8");

test("contract 1.1.0 and the four named fixtures", () => {
  assert.equal(KIT_SELECTION_BAR_VIEW_CONTRACT_VERSION, "1.1.0");
  assert.deepEqual(kitSelectionBarFixtures.map((entry) => entry.id), ["none", "one", "many", "soon"]);
  const byId = Object.fromEntries(kitSelectionBarFixtures.map((entry) => [entry.id, entry.props]));
  assert.equal(byId.none.selectedCount, 0);
  assert.equal(byId.one.selectedCount, 1);
  assert.ok(byId.many.selectedCount > 1);
  assert.equal(byId.soon.isDownloadSoon, true);
  assert.equal(byId.soon.isDeleteSoon, true);
});

// AF5 follow-up 1, item 1: the bar mounted on /studio/v2/images threw
// "callback is not defined" on the first render. Mount the ViewModel
// with every handler supplied and with every handler absent.
test("the ViewModel mounts with every handler supplied and with every handler absent", () => {
  const fired = [];
  const supplied = mountViewModel({
    selectedCount: 2,
    itemNoun: "image",
    folders: [{ id: "f1", parentId: null, name: "Cast", depth: 1 }],
    onAddToFolder: (folderId) => fired.push(`add:${folderId}`),
    onDownload: () => fired.push("download"),
    onDelete: () => fired.push("delete"),
    onDone: () => fired.push("done"),
    deleteBody: "  Named body.  ",
    dockInsets: { left: 224.4, right: "40" },
  });
  assert.equal(supplied.isVisible, true);
  assert.deepEqual(supplied.dockInsets, { left: 224.4, right: 40 });
  assert.equal(supplied.countLabel, "2 selected");
  assert.equal(supplied.noun, "images");
  assert.equal(supplied.deleteBody, "Named body.");
  assert.deepEqual(supplied.folderRows.map((row) => row.id), ["f1"]);
  supplied.onPickFolder("f1");
  supplied.onDownload();
  supplied.onConfirmDelete();
  supplied.onDone();
  assert.deepEqual(fired, ["add:f1", "download", "delete", "done"]);

  const absent = mountViewModel({ selectedCount: 1 });
  assert.equal(absent.isVisible, true);
  assert.equal(absent.dockInsets, null);
  assert.equal(mountViewModel({ selectedCount: 1, dockInsets: { left: "x" } }).dockInsets, null);
  assert.equal(absent.noun, "item");
  assert.equal(absent.deleteBody, SELECTION_BAR_COPY.deleteBody);
  assert.equal(absent.onDownload, null);
  assert.equal(absent.onDone, null);
  assert.doesNotThrow(() => {
    absent.onPickFolder("missing");
    absent.onConfirmDelete();
  });

  const empty = mountViewModel({});
  assert.equal(empty.isVisible, false);
  assert.equal(empty.selectedCount, 0);
});

test("the copy: N selected, the five controls, and the count in the delete copy", () => {
  assert.equal(SELECTION_BAR_COPY.selected(3), "3 selected");
  assert.deepEqual(
    [SELECTION_BAR_COPY.addToFolder, SELECTION_BAR_COPY.download, SELECTION_BAR_COPY.delete, SELECTION_BAR_COPY.done],
    ["Add to folder", "Download", "Delete", "Done"]
  );
  assert.equal(SELECTION_BAR_COPY.deleteTitle(4, pluralize(4, "image")), "Delete 4 selected images?");
  assert.equal(SELECTION_BAR_COPY.deleteTitle(1, pluralize(1, "creation")), "Delete 1 selected creation?");
  assert.equal(SELECTION_BAR_COPY.deleteConfirm(4), "Delete 4");
});

test("the View holds no state, carries the touch floor, the fixed max width, the sheet host, and no literal", () => {
  const view = read("KitSelectionBar.view.jsx");
  assert.doesNotMatch(view, /useState|useEffect|fetch\(|localStorage/);
  for (const needle of ["control-md", "max-w", 'variant="sheet"', "SoonChip", "role=\"toolbar\""]) {
    assert.ok(view.includes(needle), `view carries ${needle}`);
  }
  assert.doesNotMatch(view, /#[0-9a-fA-F]{3,6}|rgba?\(|text-xs|shadow-2xl|backdrop-blur/);
});

// AF5 follow-up 2, item 1: fixed at md and up, a space-5 margin from
// the bottom edge, centered between the dock insets; never sticky.
test("the bar is fixed at md and up between the page's dock insets", () => {
  const view = read("KitSelectionBar.view.jsx");
  for (const needle of [
    "md:fixed",
    "md:bottom-[var(--space-5)]",
    "md:left-[var(--selection-dock-left,var(--space-5))]",
    "md:right-[var(--selection-dock-right,var(--space-5))]",
    "max-md:fixed",
  ]) {
    assert.ok(view.includes(needle), `view carries ${needle}`);
  }
  assert.doesNotMatch(view, /md:sticky/);
  assert.match(view, /style=\{dockStyle\(dockInsets\)\}/);
});

// M2: Select all visible and Clear are not on the bar.
test("the ruled bar carries exactly the five items and none of the retired ones", () => {
  const view = read("KitSelectionBar.view.jsx");
  assert.doesNotMatch(view, /Select all visible|Clear visible|Clear selection/);
  assert.doesNotMatch(JSON.stringify(SELECTION_BAR_COPY), /Select all|Clear/);
});

test("Delete keeps its word at every width; Add to folder and Download drop to glyphs below 700", () => {
  const view = read("KitSelectionBar.view.jsx");
  // Order after the count (follow-up 2, item 7): Delete, Add to
  // folder, Download, Done.
  const marks = ["label={isBusy ? copy.deleting : copy.delete}", "label={copy.addToFolder}", "label={copy.download}", "label={copy.done}"].map(
    (needle) => view.indexOf(needle)
  );
  assert.ok(marks.every((index) => index >= 0) && marks[0] < marks[1] && marks[1] < marks[2] && marks[2] < marks[3], "Delete, Add to folder, Download, Done");
  const deleteButton = view.slice(marks[0], marks[1]);
  assert.doesNotMatch(deleteButton, /hideLabelOnPhone/);
  assert.match(deleteButton, /danger/);
  const folderButton = view.slice(marks[1], marks[2]);
  assert.match(folderButton, /hideLabelOnPhone/);
  assert.match(view, /hidden min-\[700px\]:inline/);
});

test("the delete handler runs from the confirm's primary only", () => {
  const viewModel = read("useKitSelectionBarViewModel.js");
  assert.equal((viewModel.match(/onDelete\?\.\(\)/g) || []).length, 1);
  assert.match(viewModel, /onConfirmDelete: \(\) => \{\s*setConfirmOpen\(false\);\s*onDelete\?\.\(\);/);
  const view = read("KitSelectionBar.view.jsx");
  assert.match(view, /onClick=\{onOpenDeleteConfirm\}/);
  assert.doesNotMatch(view, /onClick=\{onDelete\}/);
});
