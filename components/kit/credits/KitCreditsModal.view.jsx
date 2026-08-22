"use client";

// R1 credits collapse (10 Aug 2026, kit polish 3 pass, plan 1.3): the
// secondary surface "View all credits" opens. Header carries a back
// control (also fires onClose, same as the frame's X) and the gold
// "Credits" label; the body is a scrollable region rendering the
// existing KitCreditsView with the FULL list, the frame's own
// max-height doing the bounding.
import { ChevronLeft } from "lucide-react";

import KitCreditsView from "./KitCredits.view";

export default function KitCreditsModalView({
  credits = [],
  LinkComponent = "a",
  onClose = null,
}) {
  return (
    // Under 700px the frame's panel bottom-anchors at content height
    // (A4), so the column fills it (h-full); the 92dvh cap was a
    // leftover from the pre-A4 bottom dock and left an empty band
    // under the list (review-gate find N-4). At 700px and up the
    // centered panel is content-sized and the 80dvh cap bounds the
    // scroll region.
    <div className="flex h-full flex-col min-[700px]:h-auto min-[700px]:max-h-[80dvh]">
      <div className="flex flex-none flex-col">
        <div className="flex items-center gap-[var(--space-3)] p-[var(--space-4)]">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="cf-btn cf-btn--secondary cf-btn--sm max-[699.98px]:min-h-[var(--control-md)] inline-flex items-center gap-[var(--space-1)]"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Back
          </button>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Credits
          </p>
        </div>
        {/* B1 fade divider, never edge-to-edge. */}
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[var(--space-4)] pt-[var(--space-4)] pb-[var(--space-6)]">
        <KitCreditsView credits={credits} LinkComponent={LinkComponent} />
      </div>
    </div>
  );
}
