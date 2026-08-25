"use client";

// B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
// plan group G3), superseding the R2/R5 recomposition
// (docs/BUILD-BLUEPRINT.md 2.16 (r)). The shell owns the composition
// of KitModalFrame (veil, no panel chrome, close control) wrapping
// the view's remaining content (the glass header, the hairline-framed
// image, the gold-ink bottom bar). `title` is now a visible line in
// the header as well as the frame's accessible name.
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
