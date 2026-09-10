"use client";

// Brush editor shell (FE/MEDIA-STUDIO session 3, note 6a). Composed
// only by the image viewer (components/kit/image-viewer); Edit lives
// in the viewer and nowhere else.
import KitImageEditorView from "./image-editor/KitImageEditor.view";
import { useKitImageEditorViewModel } from "./image-editor/useKitImageEditorViewModel";

export default function KitImageEditor(props) {
  const viewProps = useKitImageEditorViewModel(props);
  return <KitImageEditorView {...viewProps} />;
}
