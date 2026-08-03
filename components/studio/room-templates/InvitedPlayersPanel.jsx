"use client";

import InvitedPlayersPanelView from "./invited-players-panel/InvitedPlayersPanel.view";
import { useInvitedPlayersPanelViewModel } from "./invited-players-panel/useInvitedPlayersPanelViewModel";

export default function InvitedPlayersPanel(props) {
  const viewProps = useInvitedPlayersPanelViewModel(props);

  return <InvitedPlayersPanelView {...viewProps} />;
}
