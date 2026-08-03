"use client";

import RoomTemplatePackagePickerModalView from "./room-template-package-picker/RoomTemplatePackagePickerModal.view";
import { useRoomTemplatePackagePickerViewModel } from "./room-template-package-picker/useRoomTemplatePackagePickerViewModel";

export default function RoomTemplatePickerModal(props) {
  const viewProps = useRoomTemplatePackagePickerViewModel(props);

  return <RoomTemplatePackagePickerModalView {...viewProps} />;
}
