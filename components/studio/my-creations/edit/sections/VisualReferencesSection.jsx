"use client";

import CreationReferenceImagePickerModal from "@/components/studio/my-creations/image-library/CreationReferenceImagePickerModal";

import VisualReferencesSectionView from "./visual-references-section/VisualReferencesSection.view";
import { useVisualReferencesSectionViewModel } from "./visual-references-section/useVisualReferencesSectionViewModel";

export default function VisualReferencesSection(props) {
  const viewProps = useVisualReferencesSectionViewModel(props);

  return (
    <VisualReferencesSectionView
      {...viewProps}
      pickerModal={
        viewProps.activePicker ? (
          <CreationReferenceImagePickerModal
            creationId={viewProps.creationId}
            referenceLabel={viewProps.activePicker.label}
            onClose={viewProps.onClosePicker}
            onSelected={viewProps.onSelectReference}
          />
        ) : null
      }
    />
  );
}
