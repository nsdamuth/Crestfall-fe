"use client";

import RoomTemplateMultiplayerSectionView from "./room-template-multiplayer-section/RoomTemplateMultiplayerSection.view";
import { useRoomTemplateMultiplayerSectionViewModel } from "./room-template-multiplayer-section/useRoomTemplateMultiplayerSectionViewModel";

export default function RoomTemplateMultiplayerSection(props) {
  const viewProps = useRoomTemplateMultiplayerSectionViewModel(props);

  return <RoomTemplateMultiplayerSectionView {...viewProps} />;
}
