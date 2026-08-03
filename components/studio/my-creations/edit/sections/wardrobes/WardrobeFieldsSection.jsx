"use client";

import OutfitPickerModal from "@/components/studio/create/wardrobe/OutfitPickerModal";

import WardrobeFieldsSectionView from "./wardrobe-fields-section/WardrobeFieldsSection.view";
import { useWardrobeFieldsSectionViewModel } from "./wardrobe-fields-section/useWardrobeFieldsSectionViewModel";

export default function WardrobeFieldsSection(props) {
  const { viewProps, applicationContentProps } =
    useWardrobeFieldsSectionViewModel(props);

  return (
    <>
      <WardrobeFieldsSectionView {...viewProps} />

      {applicationContentProps.activePickerEntry ? (
        <OutfitPickerModal
          selectedOutfitId={
            applicationContentProps.activePickerEntry.outfitCreationId
          }
          onClose={applicationContentProps.closeOutfitPicker}
          onSelect={applicationContentProps.selectOutfit}
        />
      ) : null}
    </>
  );
}
