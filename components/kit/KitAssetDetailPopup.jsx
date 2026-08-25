"use client";

// Composed on the unified modal frame (docs/BUILD-BLUEPRINT.md 2.15).
// The shell owns the composition of KitModalFrame (veil, panel,
// close control) wrapping the popup's own content view.
//
// R1 credits collapse (10 Aug 2026, kit polish 3 pass, plan 1.3): the
// shell also owns whether the stacked credits modal is open, since
// that state must reach the frame it renders (suppressing Escape and
// backdrop dismissal on THIS frame while the stacked modal is open,
// so one Escape keypress does not close both layers at once) as well
// as the view (which mounts the stacked KitCreditsModal and its
// opening control). The view reports the open/close intent back up
// through onOpenCreditsModal/onCloseCreditsModal; the frame's own
// existing closeOnEscape/closeOnBackdrop props are the only surface
// used, per the plan's sanctioned implementation.
import { useState } from "react";
import Link from "next/link";

import KitModalFrame from "./KitModalFrame";
import KitAssetDetailPopupView, {
  KIT_ASSET_DETAIL_POPUP_TITLE_ID,
} from "./asset-detail-popup/KitAssetDetailPopup.view";
import { useKitAssetDetailPopupViewModel } from "./asset-detail-popup/useKitAssetDetailPopupViewModel";

export default function KitAssetDetailPopup(props) {
  const viewProps = useKitAssetDetailPopupViewModel(props);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-xl"
      onClose={viewProps.onClose}
      ariaLabelledBy={KIT_ASSET_DETAIL_POPUP_TITLE_ID}
      closeOnEscape={!isCreditsModalOpen}
      closeOnBackdrop={!isCreditsModalOpen}
    >
      <KitAssetDetailPopupView
        {...viewProps}
        creditsLinkComponent={Link}
        isCreditsModalOpen={isCreditsModalOpen}
        onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
        onCloseCreditsModal={() => setIsCreditsModalOpen(false)}
      />
    </KitModalFrame>
  );
}
