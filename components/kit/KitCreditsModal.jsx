"use client";

// R1 credits collapse (10 Aug 2026, kit polish 3 pass, plan 1.3): the
// secondary modal the popup's "View all credits" control opens,
// stacked above it in the same space. Composed on KitModalFrame
// exactly like every other kit modal; the frame owns the veil, panel,
// and dismissal (back control and the frame's X both fire onClose).
import Link from "next/link";

import KitModalFrame from "./KitModalFrame";
import KitCreditsModalView from "./credits/KitCreditsModal.view";

export default function KitCreditsModal({ credits = [], onClose = null }) {
  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-xl"
      onClose={onClose}
      ariaLabel="Credits"
    >
      <KitCreditsModalView credits={credits} LinkComponent={Link} onClose={onClose} />
    </KitModalFrame>
  );
}
