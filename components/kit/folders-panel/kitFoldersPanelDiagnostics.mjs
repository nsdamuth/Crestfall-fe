import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kitFoldersPanelFixtures } from "./KitFoldersPanel.fixtures.js";
import { KIT_FOLDERS_PANEL_VIEW_CONTRACT_VERSION } from "./KitFoldersPanel.contract.js";
import { FOLDERS_PANEL_COPY } from "./useKitFoldersPanelViewModel.js";
import {
  applySetItemFolder,
  buildFolderRows,
  getItemFolderId,
  listParentChoices,
  normalizeFolderState,
  validateCreate,
  validateSetItemFolder,
} from "../../../lib/client/studio/folders/folderRules.js";
import { createFolderStore } from "../../../lib/client/studio/folders/folderStore.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

function fixture(id) {
  return kitFoldersPanelFixtures.find((entry) => entry.id === id).props;
}

function stateOf(id) {
  const props = fixture(id);
  return normalizeFolderState({ folders: props.folders, itemsByFolder: props.itemsByFolder }, props.surface);
}

test("contract 1.0.0 and the four named fixtures", () => {
  assert.equal(KIT_FOLDERS_PANEL_VIEW_CONTRACT_VERSION, "1.0.0");
  assert.deepEqual(kitFoldersPanelFixtures.map((entry) => entry.id), ["default", "empty", "deep", "longest"]);
  assert.equal(buildFolderRows(stateOf("empty")).length, 0);
  assert.equal(Math.max(...buildFolderRows(stateOf("deep")).map((row) => row.depth)), 3);
  assert.ok(fixture("longest").folders.every((folder) => folder.name.length <= 60));
});

// G1: a fourth level is refused, from the deep fixture's deepest row.
test("the deep fixture cannot take a fourth level", () => {
  const state = stateOf("deep");
  const deepest = buildFolderRows(state).find((row) => row.depth === 3);
  const result = validateCreate(state, { surface: "VAULT", parentId: deepest.id, name: "Fourth" });
  assert.equal(result.ok, false);
  assert.match(result.error, /3 levels/);
});

// AF5 follow-up 4, item 1: Move re-parents. A level-1 folder with one
// child moves under another level-1 folder (the child lands at level
// 3, the tree re-renders in place, the note names both), and the same
// move is refused where the child would land at level 4; the picker
// never lists the folder itself or its descendants.
test("Move re-parents a folder with its child and refuses a move that would reach level 4", () => {
  const store = createFolderStore({ surface: "MEDIA", storage: null, makeId: (() => { let n = 0; return () => `m${(n += 1)}`; })() });
  const cast = store.createFolder({ parentId: null, name: "Cast" }).folder;
  const heroes = store.createFolder({ parentId: cast.id, name: "Heroes" }).folder;
  const places = store.createFolder({ parentId: null, name: "Places" }).folder;
  const north = store.createFolder({ parentId: places.id, name: "North" }).folder;

  const choices = listParentChoices(store.getSnapshot(), { forFolderId: cast.id });
  assert.deepEqual(choices.map((choice) => choice.id), [null, places.id, north.id]);
  assert.equal(choices.find((choice) => choice.id === places.id).isAllowed, true);
  assert.equal(choices.find((choice) => choice.id === north.id).isAllowed, false);

  const moved = store.moveFolder({ folderId: cast.id, parentId: places.id });
  assert.equal(moved.ok, true);
  assert.equal(moved.note, 'Moved "Cast" into "Places".');
  assert.deepEqual(
    buildFolderRows(store.getSnapshot()).map((row) => [row.name, row.depth]),
    [["Places", 1], ["Cast", 2], ["Heroes", 3], ["North", 2]]
  );

  const refused = store.moveFolder({ folderId: cast.id, parentId: north.id });
  assert.equal(refused.ok, false);
  assert.match(refused.note, /3 levels/);
  assert.equal(store.moveFolder({ folderId: places.id, parentId: heroes.id }).ok, false);
});

// G1: a cross-surface item is refused.
test("a MEDIA item is refused by the VAULT fixture's folders", () => {
  const state = stateOf("deep");
  const result = validateSetItemFolder(state, { surface: "MEDIA", itemId: "img-1", folderId: "cast" });
  assert.equal(result.ok, false);
  assert.match(result.error, /different page/);
});

// G2: delete lifts children and items to the parent (through the store
// the panel's callbacks reach).
test("deleting the middle folder of the deep fixture lifts its child and its items one level", () => {
  const props = fixture("deep");
  const storage = new Map();
  const store = createFolderStore({
    surface: "VAULT",
    storage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
  });
  storage.set(store.storageKey, JSON.stringify({ folders: props.folders, itemsByFolder: { "cast-heroes": ["c-9"], ...props.itemsByFolder } }));
  const reopened = createFolderStore({
    surface: "VAULT",
    storage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
  });
  const result = reopened.deleteFolder({ folderId: "cast-heroes" });
  assert.equal(result.note, '"Heroes" deleted. 1 folder and 1 item moved to "Cast".');
  const state = reopened.getSnapshot();
  assert.equal(state.folders.find((folder) => folder.id === "cast-heroes-final").parentId, "cast");
  assert.equal(state.folders.find((folder) => folder.id === "cast-heroes-final").depth, 2);
  assert.deepEqual(state.itemsByFolder.cast, ["c-9"]);
});

// G2: moving an item to a second folder removes it from the first.
test("filing an item into a second folder removes it from the first", () => {
  let state = stateOf("default");
  assert.equal(getItemFolderId(state, "img-1"), "portraits");
  state = applySetItemFolder(state, { itemId: "img-1", folderId: "locations" });
  assert.equal(getItemFolderId(state, "img-1"), "locations");
  assert.deepEqual(state.itemsByFolder.portraits, ["img-2"]);
});

test("the View is stateless, reads no storage, carries both hosts, the 44px floor, and no literal", () => {
  const view = read("KitFoldersPanel.view.jsx");
  assert.doesNotMatch(view, /useEffect|useState|localStorage|fetch\(/);
  assert.doesNotMatch(view, /#[0-9a-fA-F]{3,6}|rgba?\(|text-xs|shadow-2xl/);
  for (const needle of ['variant="sheet"', "control-md", "18rem", "sticky", "truncate", "sheetGrabber", "MenuRow"]) {
    assert.ok(view.includes(needle), `view carries ${needle}`);
  }
  // The row menu never floats: the shared recipe is used without its
  // absolute position, so it cannot open past the sheet or be clipped
  // by the list's scroller.
  assert.match(view, /MENU_PANEL_RECIPE\.replace\("absolute z-50 ", ""\)/);
  // No emoji, no color choice anywhere in the panel (R4).
  assert.doesNotMatch(view, /emoji|colorPicker|swatch/i);
});

test("storage access lives only in the store, inside try blocks", () => {
  const store = read("../../../lib/client/studio/folders/folderStore.js");
  const lines = store.split("\n");
  const hits = lines.map((line, index) => [index, line]).filter(([, line]) => line.includes("localStorage"));
  assert.ok(hits.length > 0);
  for (const [index] of hits) {
    const before = lines.slice(Math.max(0, index - 3), index).join("\n");
    assert.match(before, /try \{/, `line ${index + 1} sits inside a try block`);
  }
  const viewModel = read("useKitFoldersPanelViewModel.js");
  assert.doesNotMatch(viewModel, /localStorage|folderStore/);
});

test("the copy carries the ruled title, root row, footer line, and the three menu actions", () => {
  assert.equal(FOLDERS_PANEL_COPY.title, "Folders");
  assert.equal(FOLDERS_PANEL_COPY.allLabel, "All");
  assert.equal(FOLDERS_PANEL_COPY.footerNote, "Folders are saved in this browser for now.");
  assert.deepEqual([FOLDERS_PANEL_COPY.rename, FOLDERS_PANEL_COPY.moveTo, FOLDERS_PANEL_COPY.delete], ["Rename", "Move", "Delete"]);
  assert.equal(FOLDERS_PANEL_COPY.deleteBody(2, 1, "Cast"), 'Its 2 sub-folders and 1 item move to "Cast". Nothing is deleted from your library.');
});
