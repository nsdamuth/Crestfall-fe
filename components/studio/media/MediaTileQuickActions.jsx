"use client";

import MediaTileQuickActionsView from "./media-tile-quick-actions/MediaTileQuickActions.view";
import { useMediaTileQuickActionsViewModel } from "./media-tile-quick-actions/useMediaTileQuickActionsViewModel";

export default function MediaTileQuickActions(props) {
  const viewProps = useMediaTileQuickActionsViewModel(props);

  return <MediaTileQuickActionsView {...viewProps} />;
}
