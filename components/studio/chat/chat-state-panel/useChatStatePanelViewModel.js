"use client";

/**
 * Defensive pass-through ViewModel. The mobile sheet's disclosure is
 * presentation-only local state owned inside ChatStatePanel.view.jsx;
 * this layer only normalizes what the caller hands down. Export/Share
 * are entry points only (onPress is caller-provided); the real dialogs
 * are wave C4's chat-session-dialogs package.
 */
export function useChatStatePanelViewModel({
  eyebrow = "Chronicle State",
  title = "Story Data",
  sections = [],
  actions = [],
  showCloseControl = false,
  onClosePanel,
} = {}) {
  return {
    eyebrow,
    title,
    sections: Array.isArray(sections) ? sections : [],
    actions: Array.isArray(actions) ? actions : [],
    showCloseControl: Boolean(showCloseControl),
    onClosePanel: () => onClosePanel?.(),
  };
}
