"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import RoomTemplateRuntimeSectionView from "./room-template-runtime-section/RoomTemplateRuntimeSection.view";
import { useRoomTemplateRuntimeSectionViewModel } from "./room-template-runtime-section/useRoomTemplateRuntimeSectionViewModel";

export default function RoomTemplateRuntimeSection(props) {
  const {
    viewProps,
    rulesCodexPickerProps,
    registryPickerProps,
  } = useRoomTemplateRuntimeSectionViewModel(props);

  return (
    <>
      <RoomTemplateRuntimeSectionView {...viewProps} />
      {rulesCodexPickerProps ? (
        <RegistryLinkedCreationPickerModal {...rulesCodexPickerProps} />
      ) : null}
      {registryPickerProps ? (
        <RegistryLinkedCreationPickerModal {...registryPickerProps} />
      ) : null}
    </>
  );
}
