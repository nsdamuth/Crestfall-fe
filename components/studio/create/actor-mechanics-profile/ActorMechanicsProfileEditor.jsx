"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import ActorMechanicsProfileEditorView from "./actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view";
import { useActorMechanicsProfileEditorViewModel } from "./actor-mechanics-profile-editor/useActorMechanicsProfileEditorViewModel";

export default function ActorMechanicsProfileEditor(props) {
  const { viewProps, pickerProps } =
    useActorMechanicsProfileEditorViewModel(props);

  return (
    <>
      <ActorMechanicsProfileEditorView {...viewProps} />
      {pickerProps ? (
        <RegistryLinkedCreationPickerModal {...pickerProps} />
      ) : null}
    </>
  );
}
