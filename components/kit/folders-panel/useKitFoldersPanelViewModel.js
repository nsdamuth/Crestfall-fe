"use client";

// ViewModel for KitFoldersPanel (contract 1.0.0). Owns every
// transient state the panel needs (the open row menu, the inline
// rename draft, the create, move, and delete dialogs) so the View
// stays stateless, and turns the caller's folder state into rows
// through the rules module, so the panel never re-derives depth,
// counts, or allowed targets on its own. Every write goes back to
// the caller through its callback; the returned note (if any) is
// handed to onNotice for KitNotice.
import { useState } from "react";

import {
  FOLDER_MAX_DEPTH,
  ROOT_FOLDER_LABEL,
  buildFolderRows,
  countFiledItems,
  getChildren,
  getFolder,
  getFolderName,
  listParentChoices,
  normalizeFolderState,
} from "../../../lib/client/studio/folders/folderRules.js";

export const FOLDERS_PANEL_COPY = Object.freeze({
  title: "Folders",
  allLabel: ROOT_FOLDER_LABEL,
  newFolder: "New folder",
  rename: "Rename",
  moveTo: "Move to",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  create: "Create folder",
  move: "Move",
  createTitle: "New folder",
  createNameLabel: "Name",
  createNamePlaceholder: "Name your folder...",
  createInsideLabel: "Inside",
  moveTitle: "Move to",
  deleteEyebrow: "Delete folder",
  deleteTitle: (name) => `Delete "${name}"?`,
  deleteBody: (childCount, itemCount, parentName) => {
    const target = parentName === ROOT_FOLDER_LABEL ? "All" : `"${parentName}"`;
    const parts = [];
    if (childCount) parts.push(`${childCount} sub-folder${childCount === 1 ? "" : "s"}`);
    if (itemCount) parts.push(`${itemCount} item${itemCount === 1 ? "" : "s"}`);
    if (!parts.length) return "The folder is empty. Nothing else changes.";
    return `Its ${parts.join(" and ")} move to ${target}. Nothing is deleted from your library.`;
  },
  emptyTitle: "No folders yet",
  emptyBody: "Create a folder to start organizing.",
  footerNote: "Kept on this device until folders sync.",
  menuLabel: (name) => `Options for ${name}`,
  rowLabel: (name, count) => `${name}, ${count} item${count === 1 ? "" : "s"}`,
});

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function callback(value) {
  return typeof value === "function" ? value : null;
}

const CLOSED_DIALOG = Object.freeze({ kind: null });

export function useKitFoldersPanelViewModel(props = {}) {
  const host = props.host === "sheet" ? "sheet" : "column";
  const surface = props.surface === "VAULT" ? "VAULT" : "MEDIA";
  const state = normalizeFolderState({ folders: props.folders, itemsByFolder: props.itemsByFolder }, surface);
  const selectedFolderId = getFolder(state, props.selectedFolderId) ? props.selectedFolderId : null;
  const onNotice = callback(props.onNotice);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [rename, setRename] = useState({ folderId: null, draft: "" });
  const [dialog, setDialog] = useState(CLOSED_DIALOG);
  const [dialogError, setDialogError] = useState("");

  const rows = buildFolderRows(state, { selectedFolderId });

  function report(result, tone = "neutral") {
    if (result && typeof result === "object") {
      if (result.note) onNotice?.(result.note, result.ok === false ? "danger" : tone);
      return result.ok !== false;
    }
    return true;
  }

  function closeDialog() {
    setDialog(CLOSED_DIALOG);
    setDialogError("");
  }

  // --- selection ---
  function selectFolder(folderId) {
    setMenuOpenId(null);
    callback(props.onSelectFolder)?.(folderId ?? null);
  }

  // --- row menu ---
  function toggleMenu(folderId) {
    setMenuOpenId((current) => (current === folderId ? null : folderId));
  }

  // --- inline rename ---
  function beginRename(folderId) {
    setMenuOpenId(null);
    setRename({ folderId, draft: getFolderName(state, folderId) });
  }
  function changeRenameDraft(value) {
    setRename((current) => ({ ...current, draft: value }));
  }
  function cancelRename() {
    setRename({ folderId: null, draft: "" });
  }
  function commitRename() {
    const { folderId, draft } = rename;
    if (!folderId) return;
    const name = text(draft);
    if (!name || name === getFolderName(state, folderId)) {
      cancelRename();
      return;
    }
    const ok = report(callback(props.onRenameFolder)?.({ folderId, name }));
    if (ok) cancelRename();
  }

  // --- create dialog ---
  function openCreate(parentId = null) {
    setMenuOpenId(null);
    setDialog({ kind: "create", parentId: getFolder(state, parentId) ? parentId : null, draft: "" });
    setDialogError("");
  }
  function changeCreateDraft(value) {
    setDialog((current) => (current.kind === "create" ? { ...current, draft: value } : current));
  }
  function chooseCreateParent(parentId) {
    setDialog((current) => (current.kind === "create" ? { ...current, parentId } : current));
  }
  function commitCreate() {
    if (dialog.kind !== "create") return;
    const result = callback(props.onCreateFolder)?.({ parentId: dialog.parentId, name: text(dialog.draft) });
    if (result && result.ok === false) {
      setDialogError(result.note || result.error || "");
      return;
    }
    report(result);
    closeDialog();
  }

  // --- move dialog ---
  function openMove(folderId) {
    setMenuOpenId(null);
    const folder = getFolder(state, folderId);
    if (!folder) return;
    setDialog({ kind: "move", folderId, parentId: folder.parentId });
    setDialogError("");
  }
  function chooseMoveTarget(parentId) {
    setDialog((current) => (current.kind === "move" ? { ...current, parentId } : current));
  }
  function commitMove() {
    if (dialog.kind !== "move") return;
    const result = callback(props.onMoveFolder)?.({ folderId: dialog.folderId, parentId: dialog.parentId });
    if (result && result.ok === false) {
      setDialogError(result.note || result.error || "");
      return;
    }
    report(result);
    closeDialog();
  }

  // --- delete dialog ---
  function openDelete(folderId) {
    setMenuOpenId(null);
    if (!getFolder(state, folderId)) return;
    setDialog({ kind: "delete", folderId });
    setDialogError("");
  }
  function commitDelete() {
    if (dialog.kind !== "delete") return;
    const { folderId } = dialog;
    const result = callback(props.onDeleteFolder)?.({ folderId });
    if (result && result.ok === false) {
      setDialogError(result.note || result.error || "");
      return;
    }
    report(result, "danger");
    if (selectedFolderId === folderId) callback(props.onSelectFolder)?.(getFolder(state, folderId)?.parentId ?? null);
    closeDialog();
  }

  // Display-ready dialog props, so the View reads nothing from the
  // rules module.
  let dialogView = null;
  if (dialog.kind === "create") {
    dialogView = {
      kind: "create",
      draft: dialog.draft,
      parentId: dialog.parentId,
      parentChoices: listParentChoices(state),
      error: dialogError,
    };
  } else if (dialog.kind === "move") {
    const folder = getFolder(state, dialog.folderId);
    dialogView = folder
      ? {
          kind: "move",
          folderId: folder.id,
          folderName: folder.name,
          parentId: dialog.parentId,
          parentChoices: listParentChoices(state, { forFolderId: folder.id }),
          error: dialogError,
        }
      : null;
  } else if (dialog.kind === "delete") {
    const folder = getFolder(state, dialog.folderId);
    dialogView = folder
      ? {
          kind: "delete",
          folderId: folder.id,
          folderName: folder.name,
          childCount: getChildren(state, folder.id).length,
          itemCount: state.itemsByFolder[folder.id]?.length || 0,
          parentName: getFolderName(state, folder.parentId),
          error: dialogError,
        }
      : null;
  }

  return {
    host,
    title: text(props.title) || FOLDERS_PANEL_COPY.title,
    footerNote: typeof props.footerNote === "string" ? props.footerNote : FOLDERS_PANEL_COPY.footerNote,
    maxDepth: Number.isInteger(props.maxDepth) ? props.maxDepth : FOLDER_MAX_DEPTH,
    copy: FOLDERS_PANEL_COPY,
    rows,
    allCount: Number.isFinite(props.allCount) ? props.allCount : null,
    filedCount: countFiledItems(state),
    isAllSelected: selectedFolderId === null,
    selectedFolderId,
    menuOpenId,
    renamingId: rename.folderId,
    renameDraft: rename.draft,
    dialog: dialogView,
    onSelectFolder: selectFolder,
    onToggleMenu: toggleMenu,
    onBeginRename: beginRename,
    onChangeRenameDraft: changeRenameDraft,
    onCancelRename: cancelRename,
    onCommitRename: commitRename,
    onOpenCreate: openCreate,
    onChangeCreateDraft: changeCreateDraft,
    onChooseCreateParent: chooseCreateParent,
    onCommitCreate: commitCreate,
    onOpenMove: openMove,
    onChooseMoveTarget: chooseMoveTarget,
    onCommitMove: commitMove,
    onOpenDelete: openDelete,
    onCommitDelete: commitDelete,
    onCloseDialog: closeDialog,
    onClose: callback(props.onClose),
  };
}
