"use client";

// Binding shell for the panel toggle glyph (ASSET-FOLDERS plan,
// package AF2). Hands side/open to the ViewModel and renders the
// View. The old path, components/studio/story-rooms/
// story-room-chat-shell/RailPanelGlyph.jsx, re-exports the View
// directly rather than routing through this shell, matching the
// established re-export precedent (components/studio/
// ViewModeToggle.jsx); both resolve to the same drawing.
import KitPanelToggleView from "./panel-toggle/KitPanelToggle.view";
import { useKitPanelToggleViewModel } from "./panel-toggle/useKitPanelToggleViewModel";

export default function KitPanelToggle(props) {
  const viewProps = useKitPanelToggleViewModel(props);

  return <KitPanelToggleView {...viewProps} />;
}
