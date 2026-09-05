"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";
import {
  StructuredRegistryDocumentToolsControls,
  StructuredRegistryDocumentToolsSurfaces,
} from "./structured-registry-document-tools/StructuredRegistryDocumentTools";
import StructuredRegistryBuilderView from "./structured-registry-builder/StructuredRegistryBuilder.view";
import { useStructuredRegistryBuilderViewModel } from "./structured-registry-builder/useStructuredRegistryBuilderViewModel";

export default function StructuredRegistryBuilder(props) {
  const { viewProps, linkedCreationPickerProps, documentTools } =
    useStructuredRegistryBuilderViewModel(props);

  return (
    <>
      <StructuredRegistryBuilderView {...viewProps}
        documentControls={
          <StructuredRegistryDocumentToolsControls
            {...documentTools.controlsProps}
          />
        }
      />

      <StructuredRegistryDocumentToolsSurfaces
        {...documentTools.surfacesProps}
      />

      {linkedCreationPickerProps ? (
        <RegistryLinkedCreationPickerModal {...linkedCreationPickerProps} />
      ) : null}
    </>
  );
}
