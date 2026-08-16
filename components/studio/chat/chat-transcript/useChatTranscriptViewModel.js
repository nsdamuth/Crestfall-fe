"use client";

/**
 * Defensive pass-through ViewModel. Windowing and scroll-suppression are
 * presentation-only local state and stay inside ChatTranscript.view.jsx
 * per the LOOM view hard rules (CRESTFALL_LOOM_PATTERN.md section 4.1);
 * this layer only normalizes what the caller (the chat page shell, once
 * wave C5 lands) hands down.
 */
export function useChatTranscriptViewModel({
  openingHeroImage = null,
  messageItems = [],
  loading = false,
  sending = false,
  summaryPending = false,
  errorMessage = "",
  composerHeightPx = 0,
} = {}) {
  return {
    openingHeroImage: openingHeroImage?.displayUrl ? openingHeroImage : null,
    messageItems: Array.isArray(messageItems) ? messageItems : [],
    loading: Boolean(loading),
    sending: Boolean(sending),
    summaryPending: Boolean(summaryPending),
    errorMessage: String(errorMessage || ""),
    composerHeightPx: Number.isFinite(Number(composerHeightPx))
      ? Math.max(Number(composerHeightPx), 0)
      : 0,
  };
}
