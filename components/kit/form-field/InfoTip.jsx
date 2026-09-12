"use client";

// "i" circle with a hover or tap tooltip (the InfoTip recipe from the
// character creator, inline; the shared tooltip component is CR-047,
// still open). Tap toggles, blur or Escape hides; no effects.
//
// Moved out of KitImageCreatorPanel.view.jsx (FE/MEDIA-STUDIO session
// 3, notes 6 and 6a, 10 Sep 2026) the way growTextarea was moved in
// session 2, so the composer's Advanced sliders and the image viewer's
// size note share one tooltip by construction.
//
// Anchoring, RULED 10 Sep 2026 (browser review round 6, screenshot):
// the wrapper is deliberately NOT positioned, so the tooltip anchors
// to the nearest positioned ancestor. In the composer that is the
// full-width slider row: it opens directly above that row,
// right-aligned to the row's edge, so it sits above and to the right
// of the "i" and stays inside the panel instead of running off the
// left edge as it did when anchored to the icon itself.
import { useState } from "react";
import { Info } from "lucide-react";

export const TOOLTIP_RECIPE =
  "pointer-events-none absolute bottom-full z-20 mb-[var(--space-1)] w-56 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-3)] px-[var(--space-2)] py-[var(--space-1)] text-left text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink)] shadow-[var(--shadow-modal)] transition-opacity duration-150";

export function InfoTip({ label, text, align = "right" }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <span className="group/tip inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-full)] text-[var(--gold-ornament)] hover:text-[var(--gold-bright)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
      >
        <Info size={14} aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className={`${TOOLTIP_RECIPE} ${align === "left" ? "left-0" : "right-0"} group-hover/tip:opacity-100 ${open ? "opacity-100" : "opacity-0"}`}
      >
        {text}
      </span>
    </span>
  );
}
