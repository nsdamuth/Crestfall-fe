"use client";

// ViewModel for KitSelectionBar (contract 1.0.0). Owns only the two
// dialogs' open flags (presentation state) and the phone-width flag
// that picks the folder picker's host; the selection itself and every
// handler are the page's (option 3A). The count copy lives here, not
// in the View.
import { useState } from "react";

import { usePhoneWidth } from "../modal-frame/usePhoneWidth.js";
import { buildFolderRows, normalizeFolderState } from "../../../lib/client/studio/folders/folderRules.js";
import { SELECTION_BAR_COPY, pluralize } from "./selectionBarCopy.js";

export { SELECTION_BAR_COPY, pluralize };

// The two normalizers the ViewModel reads props through (AF5 follow-up
// 1, item 1: they were referenced without being defined, so the first
// render threw once a page mounted the bar). A missing handler reads
// as null, so the View renders the control and the fire is a no-op.
function callback(value) {
  return typeof value === "function" ? value : null;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function useKitSelectionBarViewModel(props = {}) {
  const selectedCount = Number.isInteger(props.selectedCount) && props.selectedCount > 0 ? props.selectedCount : 0;
  const noun = pluralize(selectedCount, props.itemNoun);
  const isPhoneWidth = usePhoneWidth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const folderState = normalizeFolderState({ folders: props.folders }, "MEDIA");
  const folderRows = buildFolderRows(folderState).map((row) => ({ id: row.id, name: row.name, depth: row.depth }));

  const onAddToFolder = callback(props.onAddToFolder);
  const onDelete = callback(props.onDelete);

  return {
    isVisible: selectedCount > 0,
    selectedCount,
    countLabel: SELECTION_BAR_COPY.selected(selectedCount),
    noun,
    copy: SELECTION_BAR_COPY,
    isBusy: props.isBusy === true,
    isDownloadSoon: props.isDownloadSoon === true,
    isDeleteSoon: props.isDeleteSoon === true,
    deleteBody: text(props.deleteBody) || SELECTION_BAR_COPY.deleteBody,
    pickerHost: isPhoneWidth ? "sheet" : "modal",
    pickerOpen,
    folderRows,
    confirmOpen,
    onOpenPicker: () => setPickerOpen(true),
    onClosePicker: () => setPickerOpen(false),
    onPickFolder: (folderId) => {
      setPickerOpen(false);
      onAddToFolder?.(folderId);
    },
    onDownload: callback(props.onDownload),
    onOpenDeleteConfirm: () => setConfirmOpen(true),
    onCloseDeleteConfirm: () => setConfirmOpen(false),
    onConfirmDelete: () => {
      setConfirmOpen(false);
      onDelete?.();
    },
    onDone: callback(props.onDone),
  };
}
