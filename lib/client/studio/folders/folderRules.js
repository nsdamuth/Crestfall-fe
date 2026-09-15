// Folder rules (ASSET-FOLDERS plan, package AF3, RULED 14 Sep 2026).
// Pure functions over one folder state, no React, no storage: the
// store (folderStore.js) validates every write through these and the
// panel ViewModel builds its rows through these, so the rules live in
// exactly one place. Ruled: depth cap three (R3), one folder system
// scoped per surface (R2, MEDIA holds media outputs, VAULT holds
// creations, never mixed), sibling names unique within a parent,
// delete lifts children and items to the parent, one folder per item
// per surface (M1: moving an item to another folder removes it from
// the first).
//
// State shape, the same shape the folders route is expected to serve
// (the adapter in folderStore.js is the only thing that changes when
// it does):
//   {
//     surface: "MEDIA" | "VAULT",
//     folders: [{ id, surface, parentId: string|null, name, depth: 1..3, createdAt }],
//     itemsByFolder: { [folderId]: string[] }   // item ids, one folder per item
//   }

export const FOLDER_SURFACES = Object.freeze(["MEDIA", "VAULT"]);
export const FOLDER_MAX_DEPTH = 3;
export const FOLDER_NAME_MAX_LENGTH = 60;
export const ROOT_FOLDER_LABEL = "All";

export function isFolderSurface(surface) {
  return FOLDER_SURFACES.includes(surface);
}

export function createEmptyFolderState(surface) {
  return { surface: isFolderSurface(surface) ? surface : "MEDIA", folders: [], itemsByFolder: {} };
}

// A served or stored payload of unknown quality folds into a valid
// state: unknown surface falls back to the requested one, malformed
// folders drop, memberships that point at no folder drop, and every
// item keeps at most one folder (first wins).
export function normalizeFolderState(raw, surface) {
  const state = createEmptyFolderState(surface);
  const source = raw && typeof raw === "object" ? raw : {};
  const folderList = Array.isArray(source.folders) ? source.folders : [];
  const byId = new Map();

  for (const folder of folderList) {
    if (!folder || typeof folder.id !== "string" || !folder.id) continue;
    if (byId.has(folder.id)) continue;
    const name = normalizeFolderName(folder.name);
    if (!name) continue;
    byId.set(folder.id, {
      id: folder.id,
      surface: state.surface,
      parentId: typeof folder.parentId === "string" && folder.parentId ? folder.parentId : null,
      name,
      depth: 1,
      createdAt: typeof folder.createdAt === "string" ? folder.createdAt : new Date(0).toISOString(),
    });
  }

  // Drop folders whose parent chain is broken or deeper than the cap.
  const folders = [];
  for (const folder of byId.values()) {
    const depth = chainDepth(byId, folder.id);
    if (depth === null || depth > FOLDER_MAX_DEPTH) continue;
    folders.push({ ...folder, depth });
  }
  state.folders = sortFolders(folders);

  const kept = new Set(state.folders.map((folder) => folder.id));
  const seenItems = new Set();
  const memberships = source.itemsByFolder && typeof source.itemsByFolder === "object" ? source.itemsByFolder : {};
  for (const [folderId, itemIds] of Object.entries(memberships)) {
    if (!kept.has(folderId) || !Array.isArray(itemIds)) continue;
    const ids = [];
    for (const itemId of itemIds) {
      if (typeof itemId !== "string" || !itemId || seenItems.has(itemId)) continue;
      seenItems.add(itemId);
      ids.push(itemId);
    }
    if (ids.length) state.itemsByFolder[folderId] = ids;
  }

  return state;
}

function chainDepth(byId, folderId) {
  let depth = 0;
  let current = byId.get(folderId);
  const visited = new Set();
  while (current) {
    if (visited.has(current.id)) return null;
    visited.add(current.id);
    depth += 1;
    if (depth > FOLDER_MAX_DEPTH + 1) return null;
    if (current.parentId === null) return depth;
    current = byId.get(current.parentId);
  }
  return null;
}

export function normalizeFolderName(name) {
  return typeof name === "string" ? name.replace(/\s+/g, " ").trim() : "";
}

function nameKey(name) {
  return normalizeFolderName(name).toLocaleLowerCase();
}

function sortFolders(folders) {
  return [...folders].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function getFolder(state, folderId) {
  return state.folders.find((folder) => folder.id === folderId) || null;
}

export function getFolderName(state, folderId) {
  if (folderId === null || folderId === undefined) return ROOT_FOLDER_LABEL;
  return getFolder(state, folderId)?.name || ROOT_FOLDER_LABEL;
}

export function getChildren(state, parentId) {
  return sortFolders(state.folders.filter((folder) => folder.parentId === (parentId ?? null)));
}

export function getDescendantIds(state, folderId) {
  const ids = [];
  const queue = [folderId];
  while (queue.length) {
    const current = queue.shift();
    for (const child of getChildren(state, current)) {
      ids.push(child.id);
      queue.push(child.id);
    }
  }
  return ids;
}

export function getFolderDepth(state, folderId) {
  if (folderId === null || folderId === undefined) return 0;
  return getFolder(state, folderId)?.depth ?? null;
}

// Depth of the deepest folder inside a subtree, measured from the
// subtree root (the root itself counts as 1).
export function getSubtreeHeight(state, folderId) {
  let height = 1;
  for (const child of getChildren(state, folderId)) {
    height = Math.max(height, 1 + getSubtreeHeight(state, child.id));
  }
  return height;
}

export function getItemFolderId(state, itemId) {
  for (const [folderId, itemIds] of Object.entries(state.itemsByFolder)) {
    if (itemIds.includes(itemId)) return folderId;
  }
  return null;
}

// Items filed directly in the folder plus everything filed in its
// sub-folders, the number the panel shows beside each row.
export function countFolderItems(state, folderId) {
  const ids = [folderId, ...getDescendantIds(state, folderId)];
  return ids.reduce((total, id) => total + (state.itemsByFolder[id]?.length || 0), 0);
}

export function countFiledItems(state) {
  return Object.values(state.itemsByFolder).reduce((total, ids) => total + ids.length, 0);
}

function siblingNameTaken(state, parentId, name, exceptId = null) {
  const key = nameKey(name);
  return getChildren(state, parentId).some((folder) => folder.id !== exceptId && nameKey(folder.name) === key);
}

function fail(error) {
  return { ok: false, error };
}

// --- validation, one function per write ------------------------------

export function validateCreate(state, { surface, parentId = null, name } = {}) {
  if (surface !== state.surface) return fail("That folder belongs to a different page.");
  const cleanName = normalizeFolderName(name);
  if (!cleanName) return fail("Give the folder a name.");
  if (cleanName.length > FOLDER_NAME_MAX_LENGTH) {
    return fail(`Folder names are ${FOLDER_NAME_MAX_LENGTH} characters or fewer.`);
  }
  const parent = parentId ? getFolder(state, parentId) : null;
  if (parentId && !parent) return fail("That folder no longer exists.");
  const depth = (parent?.depth || 0) + 1;
  if (depth > FOLDER_MAX_DEPTH) {
    return fail(`Folders go ${FOLDER_MAX_DEPTH} levels deep at most.`);
  }
  if (siblingNameTaken(state, parentId, cleanName)) {
    return fail(`A folder named "${cleanName}" is already here.`);
  }
  return { ok: true, name: cleanName, depth, parentId: parent ? parent.id : null };
}

export function validateRename(state, { folderId, name } = {}) {
  const folder = getFolder(state, folderId);
  if (!folder) return fail("That folder no longer exists.");
  const cleanName = normalizeFolderName(name);
  if (!cleanName) return fail("Give the folder a name.");
  if (cleanName.length > FOLDER_NAME_MAX_LENGTH) {
    return fail(`Folder names are ${FOLDER_NAME_MAX_LENGTH} characters or fewer.`);
  }
  if (siblingNameTaken(state, folder.parentId, cleanName, folder.id)) {
    return fail(`A folder named "${cleanName}" is already here.`);
  }
  return { ok: true, name: cleanName, previousName: folder.name };
}

export function validateMove(state, { folderId, parentId = null } = {}) {
  const folder = getFolder(state, folderId);
  if (!folder) return fail("That folder no longer exists.");
  const target = parentId ? getFolder(state, parentId) : null;
  if (parentId && !target) return fail("That folder no longer exists.");
  if (parentId === folder.id || getDescendantIds(state, folder.id).includes(parentId)) {
    return fail("A folder cannot move inside itself.");
  }
  if ((target?.id ?? null) === folder.parentId) return fail(`"${folder.name}" is already there.`);
  const newDepth = (target?.depth || 0) + getSubtreeHeight(state, folder.id);
  if (newDepth > FOLDER_MAX_DEPTH) {
    return fail(`Folders go ${FOLDER_MAX_DEPTH} levels deep at most.`);
  }
  if (siblingNameTaken(state, target ? target.id : null, folder.name, folder.id)) {
    return fail(`A folder named "${folder.name}" is already there.`);
  }
  return { ok: true, parentId: target ? target.id : null };
}

export function validateDelete(state, { folderId } = {}) {
  const folder = getFolder(state, folderId);
  if (!folder) return fail("That folder no longer exists.");
  return { ok: true };
}

export function validateSetItemFolder(state, { surface, itemId, folderId = null } = {}) {
  if (surface !== state.surface) return fail("That item belongs to a different page.");
  if (typeof itemId !== "string" || !itemId) return fail("Nothing to file.");
  if (folderId !== null && folderId !== undefined) {
    const folder = getFolder(state, folderId);
    if (!folder) return fail("That folder no longer exists.");
    if (folder.surface !== surface) return fail("That folder belongs to a different page.");
  }
  const currentFolderId = getItemFolderId(state, itemId);
  if (currentFolderId === (folderId ?? null)) {
    return fail(folderId ? `Already in "${getFolderName(state, folderId)}".` : "Not in a folder.");
  }
  return { ok: true, previousFolderId: currentFolderId };
}

// --- application, pure, returns the next state -----------------------

export function applyCreate(state, { id, parentId = null, name, depth, createdAt }) {
  const folder = {
    id,
    surface: state.surface,
    parentId,
    name,
    depth,
    createdAt: createdAt || new Date().toISOString(),
  };
  return { ...state, folders: sortFolders([...state.folders, folder]) };
}

export function applyRename(state, { folderId, name }) {
  return {
    ...state,
    folders: sortFolders(state.folders.map((folder) => (folder.id === folderId ? { ...folder, name } : folder))),
  };
}

function withDepths(folders) {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  return folders.map((folder) => ({ ...folder, depth: chainDepth(byId, folder.id) ?? folder.depth }));
}

export function applyMove(state, { folderId, parentId = null }) {
  const moved = state.folders.map((folder) => (folder.id === folderId ? { ...folder, parentId } : folder));
  return { ...state, folders: sortFolders(withDepths(moved)) };
}

// Delete lifts: the folder's children become children of its parent
// (their own subtrees intact, depths recomputed) and the items filed
// directly in it move to the parent. At the root the parent is All,
// so those items leave every folder.
export function applyDelete(state, { folderId }) {
  const folder = getFolder(state, folderId);
  if (!folder) return state;
  const remaining = state.folders
    .filter((candidate) => candidate.id !== folderId)
    .map((candidate) =>
      candidate.parentId === folderId ? { ...candidate, parentId: folder.parentId } : candidate
    );
  const itemsByFolder = { ...state.itemsByFolder };
  const lifted = itemsByFolder[folderId] || [];
  delete itemsByFolder[folderId];
  if (folder.parentId && lifted.length) {
    itemsByFolder[folder.parentId] = [...(itemsByFolder[folder.parentId] || []), ...lifted];
  }
  return { ...state, folders: sortFolders(withDepths(remaining)), itemsByFolder };
}

// One folder per item: filing into a folder removes the item from
// whichever folder held it; a null folder removes it from all.
export function applySetItemFolder(state, { itemId, folderId = null }) {
  const itemsByFolder = {};
  for (const [id, itemIds] of Object.entries(state.itemsByFolder)) {
    const kept = itemIds.filter((candidate) => candidate !== itemId);
    if (kept.length) itemsByFolder[id] = kept;
  }
  if (folderId) {
    itemsByFolder[folderId] = [...(itemsByFolder[folderId] || []), itemId];
  }
  return { ...state, itemsByFolder };
}

// --- rows for the panel -----------------------------------------------

// Depth-first, siblings by name, each row carrying what the panel
// needs and nothing about the store.
export function buildFolderRows(state, { selectedFolderId = null } = {}) {
  const rows = [];
  const walk = (parentId) => {
    for (const folder of getChildren(state, parentId)) {
      rows.push({
        id: folder.id,
        parentId: folder.parentId,
        name: folder.name,
        depth: folder.depth,
        count: countFolderItems(state, folder.id),
        hasChildren: getChildren(state, folder.id).length > 0,
        isSelected: selectedFolderId === folder.id,
      });
      walk(folder.id);
    }
  };
  walk(null);
  return rows;
}

// Where a folder may be created or moved to: All, plus every folder
// that leaves space under the cap, minus the moving folder's own
// subtree.
export function listParentChoices(state, { forFolderId = null } = {}) {
  const excluded = new Set(forFolderId ? [forFolderId, ...getDescendantIds(state, forFolderId)] : []);
  const needed = forFolderId ? getSubtreeHeight(state, forFolderId) : 1;
  const choices = [{ id: null, name: ROOT_FOLDER_LABEL, depth: 0, isAllowed: true }];
  for (const row of buildFolderRows(state)) {
    if (excluded.has(row.id)) continue;
    choices.push({ id: row.id, name: row.name, depth: row.depth, isAllowed: row.depth + needed <= FOLDER_MAX_DEPTH });
  }
  return choices;
}

// --- notes, the plain-language line KitNotice shows ------------------

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

export const folderNotes = Object.freeze({
  created: (name, parentName = null) =>
    parentName ? `Folder "${name}" created inside "${parentName}".` : `Folder "${name}" created.`,
  renamed: (previousName, name) => `Renamed "${previousName}" to "${name}".`,
  moved: (name, targetName) => `"${name}" moved to ${targetName === ROOT_FOLDER_LABEL ? "All" : `"${targetName}"`}.`,
  deleted: (name, childCount, itemCount, parentName) => {
    if (!childCount && !itemCount) return `"${name}" deleted.`;
    const parts = [];
    if (childCount) parts.push(plural(childCount, "folder", "folders"));
    if (itemCount) parts.push(plural(itemCount, "item", "items"));
    const target = parentName === ROOT_FOLDER_LABEL ? "All" : `"${parentName}"`;
    return `"${name}" deleted. ${parts.join(" and ")} moved to ${target}.`;
  },
  filed: (folderName) => `Added to "${folderName}".`,
  refiled: (fromName, toName) => `Moved from "${fromName}" to "${toName}".`,
  unfiled: (fromName) => `Removed from "${fromName}".`,
  // A whole selection unfiled at once (the selection bar's Remove from
  // folder, AF5 follow-up 3): the page aggregates the per-item writes.
  unfiledMany: (count, fromName) => `Removed ${plural(count, "item", "items")} from "${fromName}".`,
});
