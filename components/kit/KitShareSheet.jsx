"use client";

// Binding shell for the share sheet (fe/share-og brief 1). Composed on
// the unified modal frame like the asset detail popup: the frame owns
// the veil, the panel, and the close control; this shell hands one
// share intent from useKitShareController to the View. Renders nothing
// while no intent is open. The frame is the modal variant at every
// width (follow-up 1, item 2): bottom-docked under 700px with the
// grabber, a centered 36rem popup at 700px and up.
import KitModalFrame from "./KitModalFrame";
import KitShareSheetView, { KIT_SHARE_SHEET_TITLE_ID } from "./share/KitShareSheet.view";
import { useKitShareSheetViewModel } from "./share/useKitShareSheetViewModel";

export default function KitShareSheet({
  intent = null,
  status = "idle",
  reviewState = "idle",
  canNativeShare = false,
  onCopyLink = null,
  onNativeShare = null,
  onSubmitForReview = null,
  onClose = null,
}) {
  const viewProps = useKitShareSheetViewModel({
    ...(intent || {}),
    shareUrl: intent?.url || "",
    status,
    reviewState,
    canNativeShare,
    onCopyLink,
    onNativeShare,
    onSubmitForReview,
    onClose,
  });

  if (!intent) return null;

  return (
    <KitModalFrame
      variant="modal"
      panelWidth="36rem"
      sheetGrabber
      onClose={viewProps.onClose}
      ariaLabelledBy={KIT_SHARE_SHEET_TITLE_ID}
    >
      <KitShareSheetView {...viewProps} />
    </KitModalFrame>
  );
}
