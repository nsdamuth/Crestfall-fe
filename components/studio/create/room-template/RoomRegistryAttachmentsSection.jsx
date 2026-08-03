"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import RoomRegistryAttachmentsSectionView from "./room-registry-attachments-section/RoomRegistryAttachmentsSection.view";
import { useRoomRegistryAttachmentsSectionViewModel } from "./room-registry-attachments-section/useRoomRegistryAttachmentsSectionViewModel";

export default function RoomRegistryAttachmentsSection(props) {
  const { viewProps, pickerProps } =
    useRoomRegistryAttachmentsSectionViewModel(props);

  return (
    <>
      <RoomRegistryAttachmentsSectionView {...viewProps} />
      {pickerProps ? (
        <RegistryLinkedCreationPickerModal {...pickerProps} />
      ) : null}
    </>
  );
}
