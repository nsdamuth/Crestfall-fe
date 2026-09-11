"use client";

// Image viewer shell (FE/MEDIA-STUDIO session 3, notes 6 and 6a). The
// shell composes KitModalFrame variant="viewer" (the B7 veil, no panel
// chrome, the close control, full screen under 700px) around the
// view's figure column. `title` is the frame's accessible name and a
// visible header line.
import KitModalFrame from "./KitModalFrame";
import KitImageViewerView from "./image-viewer/KitImageViewer.view";
import { useKitImageViewerViewModel } from "./image-viewer/useKitImageViewerViewModel";

export default function KitImageViewer(props) {
  const viewProps = useKitImageViewerViewModel(props);

  return (
    <KitModalFrame
      variant="viewer"
      onClose={viewProps.onClose}
      ariaLabel={viewProps.title || "Image"}
    >
      <KitImageViewerView {...viewProps} />
    </KitModalFrame>
  );
}
