"use client";

import TrackersModuleConfigModalView from "./trackers-module-config-modal/TrackersModuleConfigModal.view";
import { useTrackersModuleConfigModalViewModel } from "./trackers-module-config-modal/useTrackersModuleConfigModalViewModel";

export default function TrackersModuleConfigModal(props) {
  const viewProps = useTrackersModuleConfigModalViewModel(props);

  return <TrackersModuleConfigModalView {...viewProps} />;
}
