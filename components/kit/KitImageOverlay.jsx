"use client";

// Converted onto the unified modal frame (docs/BUILD-BLUEPRINT.md
// section 2.5), per docs/SPRINT-A-PLAN.md section 4. The shell owns
// the composition of KitModalFrame (veil, panel, close control)
// wrapping the interim view's remaining content (image, title, and
// the love/save/share action row).
import KitModalFrame from "./KitModalFrame";
import KitImageOverlayView, {
  KIT_IMAGE_OVERLAY_TITLE_ID,
} from "./image-overlay/KitImageOverlay.view";
import { useKitImageOverlayViewModel } from "./image-overlay/useKitImageOverlayViewModel";

export default function KitImageOverlay(props) {
  const viewProps = useKitImageOverlayViewModel(props);

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-[76rem] min-[700px]:w-fit"
      onClose={viewProps.onClose}
      ariaLabelledBy={viewProps.title ? KIT_IMAGE_OVERLAY_TITLE_ID : undefined}
      ariaLabel={viewProps.title ? undefined : "Image"}
    >
      <KitImageOverlayView {...viewProps} />
    </KitModalFrame>
  );
}
