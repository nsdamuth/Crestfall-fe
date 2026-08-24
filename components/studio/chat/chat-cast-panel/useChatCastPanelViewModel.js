"use client";

/**
 * Defensive pass-through ViewModel for the Party panel. Delete Story
 * moved to chat-state-panel (build-0823 pass 2, RULED 23 Aug 2026),
 * so this package owns no local confirm-step state anymore; it only
 * normalizes what the caller hands down.
 */
export function useChatCastPanelViewModel({ ...rest } = {}) {
  return { ...rest };
}
