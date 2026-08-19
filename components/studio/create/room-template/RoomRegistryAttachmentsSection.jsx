"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import RoomRegistryAttachmentsSectionView from "./room-registry-attachments-section/RoomRegistryAttachmentsSection.view";
import {
  projectRoomRegistryAttachmentLiveHydrationBinding,
} from "./room-registry-attachments-section/live-hydration-binding/RoomRegistryAttachmentLiveHydrationBinding.contract.js";
import { useRoomRegistryAttachmentsSectionViewModel } from "./room-registry-attachments-section/useRoomRegistryAttachmentsSectionViewModel";

export default function RoomRegistryAttachmentsSection(props) {
  const {
    viewProps,
    hydrationBindingInput,
    pickerProps,
  } =
    useRoomRegistryAttachmentsSectionViewModel(props);

  const hydrationBinding =
    projectRoomRegistryAttachmentLiveHydrationBinding({
      ...hydrationBindingInput,
      eyebrow: viewProps.eyebrow,
      title: viewProps.title,
      body: viewProps.body,
      onOpenRegistryPicker:
        viewProps.onOpenRegistryPicker,
      onRemoveRegistry:
        viewProps.onRemoveRegistry,
      onChangeRegistryNotes:
        viewProps.onChangeRegistryNotes,
    });

  return (
    <>
      <RoomRegistryAttachmentsSectionView
        {...hydrationBinding.currentPortableViewProps}
      />
      {pickerProps ? (
        <RegistryLinkedCreationPickerModal {...pickerProps} />
      ) : null}
    </>
  );
}
