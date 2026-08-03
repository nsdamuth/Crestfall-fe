"use client";

import VideoToolsPanelView from "./video-tools-panel/VideoToolsPanel.view";
import { useVideoToolsPanelViewModel } from "./video-tools-panel/useVideoToolsPanelViewModel";

export default function VideoToolsPanel(props) {
  const viewProps = useVideoToolsPanelViewModel(props);

  return <VideoToolsPanelView {...viewProps} />;
}
