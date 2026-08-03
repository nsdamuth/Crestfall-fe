"use client";

import ResponsiveFilterPanelView from "./responsive-filter-panel/ResponsiveFilterPanel.view";
import { useResponsiveFilterPanelViewModel } from "./responsive-filter-panel/useResponsiveFilterPanelViewModel";

export default function ResponsiveFilterPanel(props) {
  const viewProps = useResponsiveFilterPanelViewModel(props);

  return <ResponsiveFilterPanelView {...viewProps} />;
}
