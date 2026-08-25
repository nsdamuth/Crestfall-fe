"use client";

/**
 * Defensive pass-through ViewModel. Dialog open/closed state, which
 * kind is active, and every field value are caller-owned (the same
 * convention as chat-cast-panel's deleteConfirm); this layer only
 * normalizes what is handed down so the View never touches undefined
 * shapes.
 */
export function useChatSessionDialogsViewModel({ activeDialog = null, summaryPending = null } = {}) {
  return {
    activeDialog: activeDialog && typeof activeDialog === "object" ? activeDialog : null,
    summaryPending: {
      visible: Boolean(summaryPending?.visible),
      eyebrow: summaryPending?.eyebrow || "Scene Recap",
      message: summaryPending?.message || "Crestfall Engine is preparing the current scene recap",
    },
  };
}
