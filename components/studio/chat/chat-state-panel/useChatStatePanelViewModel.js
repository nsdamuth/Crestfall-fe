"use client";

import { useState } from "react";

import { CHAT_STATE_PANEL_DELETE_CONFIRMATION } from "./ChatStatePanel.contract";

/**
 * Defensive pass-through ViewModel. The mobile sheet's disclosure is
 * presentation-only local state owned inside ChatStatePanel.view.jsx;
 * this layer only normalizes what the caller hands down. Export/Share
 * are entry points only (onPress is caller-provided); the real dialogs
 * are wave C4's chat-session-dialogs package.
 *
 * Delete Story moved here from chat-cast-panel (build-0823 pass 2,
 * RULED 23 Aug 2026): this ViewModel owns the delete-confirm sheet's
 * open/closed local state, the same pattern chat-cast-panel used to
 * own, replacing window.confirm with a real kit confirm step. It does
 * not call an API; onDeleteRoom (the real delete) is caller-provided.
 */
export function useChatStatePanelViewModel({
  eyebrow = "Chronicle State",
  title = "Story Data",
  sections = [],
  actions = [],
  showCloseControl = false,
  onClosePanel,
  deletePending = false,
  onDeleteRoom,
} = {}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return {
    eyebrow,
    title,
    sections: Array.isArray(sections) ? sections : [],
    actions: Array.isArray(actions) ? actions : [],
    showCloseControl: Boolean(showCloseControl),
    onClosePanel: () => onClosePanel?.(),
    onRequestDeleteRoom: () => setConfirmOpen(true),
    deleteConfirm: confirmOpen
      ? {
          open: true,
          message: CHAT_STATE_PANEL_DELETE_CONFIRMATION,
          pending: Boolean(deletePending),
          error: "",
          onConfirm: () => onDeleteRoom?.(),
          onCancel: () => setConfirmOpen(false),
        }
      : null,
  };
}
