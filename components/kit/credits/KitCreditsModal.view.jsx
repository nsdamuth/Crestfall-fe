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
    <div className="flex max-h-[92dvh] flex-col min-[700px]:max-h-[80dvh]">
      <div className="flex flex-none items-center gap-[var(--space-3)] border-b border-[var(--line-whisper)] p-[var(--space-4)]">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="kit-focus cf-btn cf-btn--secondary cf-btn--sm inline-flex items-center gap-[var(--space-1)]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Back
        </button>
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Credits
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-[var(--space-4)]">
        <KitCreditsView credits={credits} LinkComponent={LinkComponent} />
      </div>
    </div>
  );
}
