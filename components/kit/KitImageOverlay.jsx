"use client";

// INTERIM shell. Converts to the unified modal frame (section 2.5) in
// batch 2; see components/kit/image-overlay/README.md.
import KitImageOverlayView from "./image-overlay/KitImageOverlay.view";
import { useKitImageOverlayViewModel } from "./image-overlay/useKitImageOverlayViewModel";

export default function KitImageOverlay(props) {
  const viewProps = useKitImageOverlayViewModel(props);

  return <KitImageOverlayView {...viewProps} />;
}
