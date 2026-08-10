"use client";

// Recomposed onto the modal frame's viewer variant (R2/R5, 10 Aug
// 2026, kit polish 3 pass, docs/BUILD-BLUEPRINT.md 2.16 (r)). The
// shell owns the composition of KitModalFrame (chrome-frost veil, no
// panel chrome, close control) wrapping the view's remaining content
// (the hairline-framed image and its action shelf). No visible title
// line renders on the viewer; `title` is the accessible name only.
import KitModalFrame from "./KitModalFrame";
import KitImageOverlayView from "./image-overlay/KitImageOverlay.view";
import { useKitImageOverlayViewModel } from "./image-overlay/useKitImageOverlayViewModel";

export default function KitImageOverlay(props) {
  const viewProps = useKitImageOverlayViewModel(props);

  return (
    <KitModalFrame
      variant="viewer"
      onClose={viewProps.onClose}
      ariaLabel={viewProps.title || "Image"}
    >
      <KitImageOverlayView {...viewProps} />
    </KitModalFrame>
  );
}
