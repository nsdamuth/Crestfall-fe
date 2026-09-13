"use client";

// The panel toggle glyph and the bare icon recipe (fe/chat-studio brief
// 2 items 5 and 11, 13 Sep 2026; one rotating glyph for all three
// toggles by brief 3 item 3): the bare icon ruled 10 Sep 2026 (no
// circle, no fill, dim ink at rest, gold on hover, deep gold pressed,
// 44px target, the global focus ring). One file, imported by the primary
// sidebar's collapse toggle, the chat shell's two rail edge toggles, and
// the composer's mobile story list button, so none of them drift.
//
// One glyph, never mirrored: the panel line sits on the left. Open and
// closed differ by a 180 degree turn over --dur-fast, so the direction
// always reads: the line faces the panel while it is open and turns
// away when it is closed. For a panel on the left edge (the primary
// sidebar, the story list) open is the resting orientation; for the
// details rail on the right edge open is the turned one. The global
// reduced-motion rule in app/design-system.css zeroes the transition.

export const BARE_ICON_BUTTON_CLASS =
  "grid h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation place-items-center rounded-[var(--radius-md)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--gold-action)] active:text-[var(--gold-deep)]";

export default function RailPanelGlyph({ side = "left", open = false }) {
  const turned = side === "right" ? open : !open;

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
      className={`transition-transform duration-[var(--dur-fast)] ease-[var(--ease)] ${
        turned ? "rotate-180" : "rotate-0"
      }`}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}
