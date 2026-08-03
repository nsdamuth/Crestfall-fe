"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";
import StructuredRegistryBuilderView from "./structured-registry-builder/StructuredRegistryBuilder.view";
import { useStructuredRegistryBuilderViewModel } from "./structured-registry-builder/useStructuredRegistryBuilderViewModel";

export default function StructuredRegistryBuilder(props) {
  const { viewProps, linkedCreationPickerProps } =
    useStructuredRegistryBuilderViewModel(props);

  return (
    <>
      <StructuredRegistryBuilderView {...viewProps} />

      {linkedCreationPickerProps ? (
        <RegistryLinkedCreationPickerModal {...linkedCreationPickerProps} />
      ) : null}
    </>
  );
}
