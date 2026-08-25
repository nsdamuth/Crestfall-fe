"use client";

// Composed on the unified modal frame (docs/BUILD-BLUEPRINT.md 2.15).
// The shell owns the composition of KitModalFrame (veil, panel,
// close control) wrapping the popup's own content view.
//
// Credits are rendered in the popup's conditional Credits tab. The
// shell therefore has no stacked attribution-modal state to own.
import Link from "next/link";

import KitModalFrame from "./KitModalFrame";
import KitAssetDetailPopupView, {
  KIT_ASSET_DETAIL_POPUP_TITLE_ID,
} from "./asset-detail-popup/KitAssetDetailPopup.view";
import { useKitAssetDetailPopupViewModel } from "./asset-detail-popup/useKitAssetDetailPopupViewModel";

export default function KitAssetDetailPopup(props) {
  const viewProps = useKitAssetDetailPopupViewModel(props);
  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-xl"
      onClose={viewProps.onClose}
      ariaLabelledBy={KIT_ASSET_DETAIL_POPUP_TITLE_ID}
    >
      <KitAssetDetailPopupView
        {...viewProps}
        creditsLinkComponent={Link}
      />
    </KitModalFrame>
  );
}
