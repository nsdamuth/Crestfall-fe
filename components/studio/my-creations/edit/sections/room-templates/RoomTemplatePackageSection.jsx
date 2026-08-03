"use client";

import RoomTemplatePackageSectionView from "./room-template-package-section/RoomTemplatePackageSection.view";
import { useRoomTemplatePackageSectionViewModel } from "./room-template-package-section/useRoomTemplatePackageSectionViewModel";

export default function RoomTemplatePackageSection(props) {
  const viewProps = useRoomTemplatePackageSectionViewModel(props);

  return <RoomTemplatePackageSectionView {...viewProps} />;
}
