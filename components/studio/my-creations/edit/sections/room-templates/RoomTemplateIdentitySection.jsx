"use client";

import RoomTemplateIdentitySectionView from "./room-template-identity-section/RoomTemplateIdentitySection.view";
import { useRoomTemplateIdentitySectionViewModel } from "./room-template-identity-section/useRoomTemplateIdentitySectionViewModel";

export default function RoomTemplateIdentitySection(props) {
  const viewProps = useRoomTemplateIdentitySectionViewModel(props);

  return <RoomTemplateIdentitySectionView {...viewProps} />;
}
