"use client";

import RoomTemplatePickerModalView from "./room-template-picker/RoomTemplatePickerModal.view";
import { useRoomTemplatePickerViewModel } from "./room-template-picker/useRoomTemplatePickerViewModel";

export default function RoomTemplatePickerModal(props) {
  const viewProps = useRoomTemplatePickerViewModel(props);

  return <RoomTemplatePickerModalView {...viewProps} />;
}
