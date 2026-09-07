"use client";

import KitFilterPanelView from "./filter-panel/KitFilterPanel.view";
import { useKitFilterPanelViewModel } from "./filter-panel/useKitFilterPanelViewModel";

export default function KitFilterPanel(props) {
  const viewProps = useKitFilterPanelViewModel(props);

  return <KitFilterPanelView {...viewProps} />;
}
