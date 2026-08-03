"use client";

import RoomTemplateOpeningSectionView from "./room-template-opening-section/RoomTemplateOpeningSection.view";
import { useRoomTemplateOpeningSectionViewModel } from "./room-template-opening-section/useRoomTemplateOpeningSectionViewModel";

export default function RoomTemplateOpeningSection(props) {
  const viewProps = useRoomTemplateOpeningSectionViewModel(props);

  return <RoomTemplateOpeningSectionView {...viewProps} />;
}
