"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import LocationRegistryAttachmentsSectionView from "./location-registry-attachments-section/LocationRegistryAttachmentsSection.view";
import { useLocationRegistryAttachmentsSectionViewModel } from "./location-registry-attachments-section/useLocationRegistryAttachmentsSectionViewModel";

export default function LocationRegistryAttachmentsSection(props) {
  const { pickerModalProps, ...viewProps } =
    useLocationRegistryAttachmentsSectionViewModel(props);

  const pickerSlot = pickerModalProps ? (
    <RegistryLinkedCreationPickerModal {...pickerModalProps} />
  ) : null;

  return (
    <LocationRegistryAttachmentsSectionView
      {...viewProps}
      pickerSlot={pickerSlot}
    />
  );
}
