"use client";

import KitImageCreatorPanelView from "./image-creator-panel/KitImageCreatorPanel.view";
import { useKitImageCreatorPanelViewModel } from "./image-creator-panel/useKitImageCreatorPanelViewModel";

export default function KitImageCreatorPanel(props) {
  const viewProps = useKitImageCreatorPanelViewModel(props);

  return <KitImageCreatorPanelView {...viewProps} />;
}
