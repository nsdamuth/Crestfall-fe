"use client";

// The rail panel glyph and the bare icon recipe (fe/chat-studio brief
// 2 items 5 and 11, 13 Sep 2026): the primary sidebar's collapse
// toggle glyph and recipe
// (components/studio/studio-sidebar/StudioSidebar.view.jsx, the bare
// icon ruled 10 Sep 2026: no circle, no fill, dim ink at rest, gold on
// hover, deep gold pressed, 44px target, the global focus ring). One
// file, imported by the chat shell's rail edge toggles and by the
// composer's mobile story list button, so the two never drift. The
// right rail's glyph mirrors the panel line to its own side.

export const BARE_ICON_BUTTON_CLASS =
  "grid h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation place-items-center rounded-[var(--radius-md)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--gold-action)] active:text-[var(--gold-deep)]";

export default function RailPanelGlyph({ side = "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d={side === "right" ? "M15 4v16" : "M9 4v16"} />
    </svg>
  );
}
