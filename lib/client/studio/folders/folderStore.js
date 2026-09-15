// Folder store (ASSET-FOLDERS plan, package AF3, option 2A RULED
// 14 Sep 2026): one adapter, shaped like the route the FE expects,
// holding the folder state for one surface in this browser until the
// folders route lands. This file is the only thing that changes when
// it does: the reads become fetches and the five writes become
// requests, while the rules (folderRules.js), the panel, and both
// pages keep calling the same functions.
//
// Expected route, quoted in the Slack handoff:
//   GET    /api/folders?surface=MEDIA|VAULT
//            -> { surface, folders: [{ id, surface, parentId, name, depth, createdAt }], itemsByFolder: { [folderId]: itemId[] } }
//   POST   /api/folders                { surface, parentId, name }      -> the folder
//   PATCH  /api/folders/{id}           { name } | { parentId }          -> the folder
//   DELETE /api/folders/{id}                                             -> children and items lifted to the parent
//   PUT    /api/folders/items/{itemId} { surface, folderId | null }     -> one folder per item per surface
//
// Persistence is per surface in browser storage, every access inside
// a try block; storage that is missing, blocked, or corrupt reads as
// an empty tree and a failed write keeps the in-memory state so the
// panel never goes blank mid-edit. Every write validates through the
// rules, applies, persists, notifies subscribers, and returns
// { ok, note } where note is the plain-language line KitNotice shows
// (on failure, the reason).
import {
  applyCreate,
  applyDelete,
  applyMove,
  applyRename,
  applySetItemFolder,
  countFolderItems,
  createEmptyFolderState,
  folderNotes,
  getChildren,
  getFolder,
  getFolderName,
  isFolderSurface,
  normalizeFolderState,
  validateCreate,
  validateDelete,
  validateMove,
  validateRename,
  validateSetItemFolder,
} from "./folderRules.js";

const STORAGE_KEY_PREFIX = "crestfall.folders.";
const STORAGE_VERSION = "v1";

export function folderStorageKey(surface) {
  return `${STORAGE_KEY_PREFIX}${surface}.${STORAGE_VERSION}`;
}

function defaultStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function readStorage(storage, key) {
  try {
    const raw = storage?.getItem?.(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(storage, key, state) {
  try {
    storage?.setItem?.(key, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function clearStorage(storage, key) {
  try {
    storage?.removeItem?.(key);
  } catch {
    // Nothing to do: the in-memory state is already empty.
  }
}

function defaultId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // Fall through to the time-based id.
  }
  return `folder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createFolderStore({
  surface,
  storage = defaultStorage(),
  now = () => new Date().toISOString(),
  makeId = defaultId,
} = {}) {
  if (!isFolderSurface(surface)) {
    throw new Error(`Unknown folder surface: ${String(surface)}`);
  }
  const key = folderStorageKey(surface);
  const emptyState = createEmptyFolderState(surface);
  const listeners = new Set();
  let state = normalizeFolderState(readStorage(storage, key), surface);

  function commit(next) {
    state = next;
    writeStorage(storage, key, state);
    for (const listener of listeners) listener();
  }

  function refuse(validation) {
    return { ok: false, error: validation.error, note: validation.error };
  }

  return {
    surface,
    storageKey: key,
    getSnapshot: () => state,
    getServerSnapshot: () => emptyState,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    createFolder({ parentId = null, name } = {}) {
      const check = validateCreate(state, { surface, parentId, name });
      if (!check.ok) return refuse(check);
      const folder = {
        id: makeId(),
        parentId: check.parentId,
        name: check.name,
        depth: check.depth,
        createdAt: now(),
      };
      commit(applyCreate(state, folder));
      const parentName = check.parentId ? getFolderName(state, check.parentId) : null;
      return { ok: true, folder: getFolder(state, folder.id), note: folderNotes.created(check.name, parentName) };
    },

    renameFolder({ folderId, name } = {}) {
      const check = validateRename(state, { folderId, name });
      if (!check.ok) return refuse(check);
      commit(applyRename(state, { folderId, name: check.name }));
      return { ok: true, folder: getFolder(state, folderId), note: folderNotes.renamed(check.previousName, check.name) };
    },

    moveFolder({ folderId, parentId = null } = {}) {
      const check = validateMove(state, { folderId, parentId });
      if (!check.ok) return refuse(check);
      const name = getFolderName(state, folderId);
      commit(applyMove(state, { folderId, parentId: check.parentId }));
      return { ok: true, folder: getFolder(state, folderId), note: folderNotes.moved(name, getFolderName(state, check.parentId)) };
    },

    deleteFolder({ folderId } = {}) {
      const check = validateDelete(state, { folderId });
      if (!check.ok) return refuse(check);
      const folder = getFolder(state, folderId);
      const childCount = getChildren(state, folderId).length;
      const itemCount = state.itemsByFolder[folderId]?.length || 0;
      const parentName = getFolderName(state, folder.parentId);
      commit(applyDelete(state, { folderId }));
      return { ok: true, note: folderNotes.deleted(folder.name, childCount, itemCount, parentName) };
    },

    // folderId null removes the item from every folder on this surface.
    setItemFolder({ itemId, folderId = null } = {}) {
      const check = validateSetItemFolder(state, { surface, itemId, folderId });
      if (!check.ok) return refuse(check);
      const fromName = check.previousFolderId ? getFolderName(state, check.previousFolderId) : null;
      const toName = folderId ? getFolderName(state, folderId) : null;
      commit(applySetItemFolder(state, { itemId, folderId }));
      let note;
      if (toName && fromName) note = folderNotes.refiled(fromName, toName);
      else if (toName) note = folderNotes.filed(toName);
      else note = folderNotes.unfiled(fromName);
      return { ok: true, note };
    },

    countFolderItems: (folderId) => countFolderItems(state, folderId),

    // Clears this surface's folders from the browser. For diagnostics
    // and for a future sign-out; no page calls it today.
    reset() {
      clearStorage(storage, key);
      commit(createEmptyFolderState(surface));
    },
  };
}

// One store per surface per browser tab, shared by every consumer on
// the page so the panel, the selection bar, and the grid read one
// state.
const stores = new Map();

export function getFolderStore(surface, options = {}) {
  if (!stores.has(surface)) stores.set(surface, createFolderStore({ surface, ...options }));
  return stores.get(surface);
}
