"use client";

import { useState } from "react";

import { CHAT_CAST_PANEL_DELETE_CONFIRMATION } from "./ChatCastPanel.contract";

/**
 * Defensive pass-through ViewModel. Owns one piece of real behavior:
 * the delete-confirm sheet's open/closed local state, replacing the
 * crestfall-main baseline's window.confirm with a real kit confirm
 * step carrying the same copy. Does not call an API or own room
 * persistence; onDeleteRoom (the real delete) is caller-provided and
 * wired live once wave C5's chat page shell binds a live room.
 */
export function useChatCastPanelViewModel({
  deleteAction = {},
  deleteError = "",
  deletePending = false,
  onDeleteRoom,
  ...rest
} = {}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const safeDeleteAction = deleteAction || {};

  return {
    ...rest,
    deleteAction: safeDeleteAction,
    deleteError,
    onRequestDeleteRoom: safeDeleteAction.visible ? () => setConfirmOpen(true) : null,
    deleteConfirm: confirmOpen
      ? {
          open: true,
          message: CHAT_CAST_PANEL_DELETE_CONFIRMATION,
          pending: Boolean(deletePending),
          error: deleteError,
          onConfirm: () => onDeleteRoom?.(),
          onCancel: () => setConfirmOpen(false),
        }
      : null,
  };
}
