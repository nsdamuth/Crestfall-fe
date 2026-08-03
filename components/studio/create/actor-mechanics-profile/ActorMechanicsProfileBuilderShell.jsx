"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import ActorMechanicsProfileBuilderView from "./actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view";
import { useActorMechanicsProfileBuilderViewModel } from "./actor-mechanics-profile-builder/useActorMechanicsProfileBuilderViewModel";

export default function ActorMechanicsProfileBuilderShell(props) {
  const { editorPickerProps, ...viewProps } =
    useActorMechanicsProfileBuilderViewModel(props);

  return (
    <>
      <ActorMechanicsProfileBuilderView {...viewProps} />
      {editorPickerProps ? (
        <RegistryLinkedCreationPickerModal {...editorPickerProps} />
      ) : null}
    </>
  );
}
