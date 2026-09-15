import assert from "node:assert/strict";
import test from "node:test";

import { applyMediaHistoryFilters } from "../../../../components/studio/image-studio/media-history-grid/mediaHistoryVisibility.js";

import {
  FOLDER_MAX_DEPTH,
  applyCreate,
  applyDelete,
  applySetItemFolder,
  buildFolderRows,
  countFolderItems,
  createEmptyFolderState,
  folderNotes,
  getItemFolderId,
  getDescendantIds,
  listParentChoices,
  normalizeFolderState,
  validateCreate,
  validateMove,
  validateRename,
  validateSetItemFolder,
} from "./folderRules.js";
import { createFolderStore } from "./folderStore.js";

function memoryStorage() {
  const map = new Map();
  return {
    map,
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}

function sequentialIds() {
  let n = 0;
  return () => `f${(n += 1)}`;
}

function threeLevels() {
  let state = createEmptyFolderState("MEDIA");
  state = applyCreate(state, { id: "a", name: "A", depth: 1, parentId: null });
  state = applyCreate(state, { id: "b", name: "B", depth: 2, parentId: "a" });
  state = applyCreate(state, { id: "c", name: "C", depth: 3, parentId: "b" });
  return state;
}

// G1: a fourth level is refused.
// AF5 follow-up 3, item 3: nested folders end to end through the
// store the page binds. Create walks three levels through the Inside
// choices, the rows render each level under its parent in order, the
// Inside list and the Move picker refuse a fourth level, and a chosen
// child filters the grid through its own items plus its sub-folders'.
test("create, render, and move walk all three levels and a fourth is refused", () => {
  const store = createFolderStore({ surface: "MEDIA", storage: null, makeId: (() => { let n = 0; return () => `f${(n += 1)}`; })() });
  const state = () => store.getSnapshot();

  // Level 1 from the root, level 2 inside it, level 3 inside that,
  // each parent chosen from the Inside list the create dialog shows.
  const root = store.createFolder({ parentId: null, name: "Cast" });
  assert.equal(root.ok, true);
  assert.ok(listParentChoices(state()).find((choice) => choice.id === root.folder.id).isAllowed);
  const child = store.createFolder({ parentId: root.folder.id, name: "Heroes" });
  assert.equal(child.ok, true);
  assert.equal(child.folder.depth, 2);
  assert.match(child.note, /inside "Cast"/);
  const grandchild = store.createFolder({ parentId: child.folder.id, name: "Knights" });
  assert.equal(grandchild.ok, true);
  assert.equal(grandchild.folder.depth, 3);

  // Render: each level sits under its parent, in order, at its depth.
  assert.deepEqual(
    buildFolderRows(state()).map((row) => [row.name, row.depth, row.parentId]),
    [["Cast", 1, null], ["Heroes", 2, root.folder.id], ["Knights", 3, child.folder.id]]
  );

  // A fourth level: the Inside list marks the level-3 folder Full and
  // the write itself is refused.
  assert.equal(listParentChoices(state()).find((choice) => choice.id === grandchild.folder.id).isAllowed, false);
  const fourth = store.createFolder({ parentId: grandchild.folder.id, name: "Squires" });
  assert.equal(fourth.ok, false);
  assert.match(fourth.note, /3 levels/);

  // Move: a root folder may move under level 2 (it lands at level 3)
  // but not under level 3; the picker says the same before the write.
  const other = store.createFolder({ parentId: null, name: "Places" });
  const moveChoices = listParentChoices(state(), { forFolderId: other.folder.id });
  assert.equal(moveChoices.find((choice) => choice.id === child.folder.id).isAllowed, true);
  assert.equal(moveChoices.find((choice) => choice.id === grandchild.folder.id).isAllowed, false);
  assert.equal(store.moveFolder({ folderId: other.folder.id, parentId: grandchild.folder.id }).ok, false);
  const moved = store.moveFolder({ folderId: other.folder.id, parentId: child.folder.id });
  assert.equal(moved.ok, true);
  assert.equal(moved.folder.depth, 3);
  // The moved folder's parent may not move under its own subtree.
  assert.equal(store.moveFolder({ folderId: root.folder.id, parentId: other.folder.id }).ok, false);
  // And a subtree of height two cannot hang from level 2.
  assert.equal(store.moveFolder({ folderId: root.folder.id, parentId: child.folder.id }).ok, false);

  // A chosen child filters the grid: the Media page reads the folder
  // plus its descendants' items, after the Library filter.
  assert.equal(store.setItemFolder({ itemId: "img-1", folderId: child.folder.id }).ok, true);
  assert.equal(store.setItemFolder({ itemId: "vid-1", folderId: grandchild.folder.id }).ok, true);
  assert.equal(store.setItemFolder({ itemId: "img-2", folderId: root.folder.id }).ok, true);
  const chosen = child.folder.id;
  const folderItemIds = [chosen, ...getDescendantIds(state(), chosen)].flatMap((id) => state().itemsByFolder[id] || []);
  assert.deepEqual(folderItemIds.sort(), ["img-1", "vid-1"]);
  const items = [
    { id: "img-1", imageOutputId: "img-1", type: "IMAGE" },
    { id: "vid-1", imageOutputId: "vid-1", type: "VIDEO" },
    { id: "img-2", imageOutputId: "img-2", type: "IMAGE" },
  ];
  assert.deepEqual(applyMediaHistoryFilters(items, "ALL", folderItemIds).map((item) => item.id), ["img-1", "vid-1"]);
  assert.deepEqual(applyMediaHistoryFilters(items, "VIDEOS", folderItemIds).map((item) => item.id), ["vid-1"]);
  assert.equal(countFolderItems(state(), root.folder.id), 3);
});

test("create refuses a fourth level and move refuses a subtree that would reach one", () => {
  const state = threeLevels();
  assert.equal(FOLDER_MAX_DEPTH, 3);
  const fourth = validateCreate(state, { surface: "MEDIA", parentId: "c", name: "D" });
  assert.equal(fourth.ok, false);
  assert.match(fourth.error, /3 levels/);
  // Moving A (height 3) under a root sibling would make C level 4.
  const withSibling = applyCreate(state, { id: "s", name: "S", depth: 1, parentId: null });
  const move = validateMove(withSibling, { folderId: "a", parentId: "s" });
  assert.equal(move.ok, false);
  assert.match(move.error, /3 levels/);
  // Level three itself is allowed.
  assert.equal(validateCreate(state, { surface: "MEDIA", parentId: "b", name: "C2" }).ok, true);
});

// G1: a cross-surface item is refused.
test("a VAULT item cannot be filed into a MEDIA folder, and a VAULT store never lists MEDIA", () => {
  const state = threeLevels();
  const crossed = validateSetItemFolder(state, { surface: "VAULT", itemId: "creation-1", folderId: "a" });
  assert.equal(crossed.ok, false);
  assert.match(crossed.error, /different page/);
  assert.equal(validateCreate(state, { surface: "VAULT", parentId: null, name: "Nope" }).ok, false);
  const vault = normalizeFolderState({ folders: state.folders, itemsByFolder: { a: ["x"] } }, "VAULT");
  assert.ok(vault.folders.every((folder) => folder.surface === "VAULT"));
});

// G2: delete lifts children and items to the parent.
test("delete lifts the folder's children and its items to the parent; at the root, items leave every folder", () => {
  let state = threeLevels();
  state = applySetItemFolder(state, { itemId: "img-b", folderId: "b" });
  state = applySetItemFolder(state, { itemId: "img-c", folderId: "c" });
  const afterMiddle = applyDelete(state, { folderId: "b" });
  const c = afterMiddle.folders.find((folder) => folder.id === "c");
  assert.equal(c.parentId, "a");
  assert.equal(c.depth, 2);
  assert.deepEqual(afterMiddle.itemsByFolder.a, ["img-b"]);
  assert.deepEqual(afterMiddle.itemsByFolder.c, ["img-c"]);
  const afterRoot = applyDelete(afterMiddle, { folderId: "a" });
  assert.equal(afterRoot.folders.find((folder) => folder.id === "c").parentId, null);
  assert.equal(getItemFolderId(afterRoot, "img-b"), null);
  assert.equal(folderNotes.deleted("A", 1, 1, "All"), '"A" deleted. 1 folder and 1 item moved to All.');
});

// G2: moving an item to a second folder removes it from the first.
test("an item lives in one folder per surface", () => {
  let state = threeLevels();
  state = applySetItemFolder(state, { itemId: "img-1", folderId: "a" });
  state = applySetItemFolder(state, { itemId: "img-1", folderId: "c" });
  assert.deepEqual(state.itemsByFolder.a, undefined);
  assert.deepEqual(state.itemsByFolder.c, ["img-1"]);
  assert.equal(getItemFolderId(state, "img-1"), "c");
  state = applySetItemFolder(state, { itemId: "img-1", folderId: null });
  assert.equal(getItemFolderId(state, "img-1"), null);
  const duplicated = normalizeFolderState({ folders: state.folders, itemsByFolder: { a: ["dup"], c: ["dup"] } }, "MEDIA");
  assert.deepEqual(duplicated.itemsByFolder, { a: ["dup"] });
});

test("sibling names are unique within a parent, case-insensitively, and never empty", () => {
  const state = threeLevels();
  assert.equal(validateCreate(state, { surface: "MEDIA", parentId: null, name: " a " }).ok, false);
  assert.equal(validateCreate(state, { surface: "MEDIA", parentId: "a", name: "A" }).ok, true);
  assert.equal(validateCreate(state, { surface: "MEDIA", parentId: null, name: "   " }).ok, false);
  assert.equal(validateRename(state, { folderId: "b", name: "b" }).ok, true);
  assert.equal(validateRename(state, { folderId: "c", name: "x".repeat(61) }).ok, false);
});

test("rows count filed items through sub-folders and parent choices exclude the moving subtree", () => {
  let state = threeLevels();
  state = applySetItemFolder(state, { itemId: "i1", folderId: "c" });
  state = applySetItemFolder(state, { itemId: "i2", folderId: "b" });
  assert.equal(countFolderItems(state, "a"), 2);
  const rows = buildFolderRows(state, { selectedFolderId: "b" });
  assert.deepEqual(rows.map((row) => [row.id, row.depth, row.count, row.isSelected]), [
    ["a", 1, 2, false],
    ["b", 2, 2, true],
    ["c", 3, 1, false],
  ]);
  const choices = listParentChoices(state, { forFolderId: "b" });
  assert.deepEqual(choices.map((choice) => [choice.id, choice.isAllowed]), [
    [null, true],
    ["a", true],
  ]);
});

test("the store persists per surface behind try and catch, returns a note on every write, and reads corrupt storage as empty", () => {
  const storage = memoryStorage();
  const store = createFolderStore({ surface: "MEDIA", storage, makeId: sequentialIds(), now: () => "2026-09-14T00:00:00.000Z" });
  assert.equal(store.createFolder({ name: "Portraits" }).note, 'Folder "Portraits" created.');
  assert.equal(store.createFolder({ parentId: "f1", name: "Studio" }).note, 'Folder "Studio" created inside "Portraits".');
  assert.equal(store.setItemFolder({ itemId: "img-1", folderId: "f2" }).note, 'Added to "Studio".');
  assert.equal(store.setItemFolder({ itemId: "img-1", folderId: "f1" }).note, 'Moved from "Studio" to "Portraits".');
  assert.equal(store.renameFolder({ folderId: "f2", name: "Studio tests" }).note, 'Renamed "Studio" to "Studio tests".');
  assert.equal(store.moveFolder({ folderId: "f2", parentId: null }).note, 'Moved "Studio tests" into All.');
  assert.equal(store.deleteFolder({ folderId: "f1" }).note, '"Portraits" deleted. 1 item moved to All.');
  const refused = store.setItemFolder({ itemId: "img-9", folderId: "missing" });
  assert.equal(refused.ok, false);
  assert.equal(refused.note, refused.error);
  assert.ok(storage.map.has("crestfall.folders.MEDIA.v1"));
  const reopened = createFolderStore({ surface: "MEDIA", storage });
  assert.deepEqual(reopened.getSnapshot().folders.map((folder) => folder.name), ["Studio tests"]);
  const broken = memoryStorage();
  broken.setItem("crestfall.folders.VAULT.v1", "{not json");
  assert.deepEqual(createFolderStore({ surface: "VAULT", storage: broken }).getSnapshot().folders, []);
  const throwing = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  const blocked = createFolderStore({ surface: "VAULT", storage: throwing });
  assert.equal(blocked.createFolder({ name: "Still works in memory" }).ok, true);
  assert.equal(blocked.getSnapshot().folders.length, 1);
});
