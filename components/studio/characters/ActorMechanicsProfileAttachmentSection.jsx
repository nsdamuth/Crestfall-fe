"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import ActorMechanicsProfileAttachmentSectionView from "./actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view";
import { useActorMechanicsProfileAttachmentSectionViewModel } from "./actor-mechanics-profile-attachment/useActorMechanicsProfileAttachmentSectionViewModel";

export default function ActorMechanicsProfileAttachmentSection(props) {
  const { viewProps, pickerProps } =
    useActorMechanicsProfileAttachmentSectionViewModel(props);

  return (
    <>
      <ActorMechanicsProfileAttachmentSectionView {...viewProps} />
      {pickerProps ? (
        <RegistryLinkedCreationPickerModal {...pickerProps} />
      ) : null}
    </>
  );
}
