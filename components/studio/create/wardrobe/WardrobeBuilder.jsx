"use client";

import OutfitPickerModal from "@/components/studio/create/wardrobe/OutfitPickerModal";
import WardrobeBuilderView from "./wardrobe-builder/WardrobeBuilder.view";
import { useWardrobeBuilderViewModel } from "./wardrobe-builder/useWardrobeBuilderViewModel";

export default function WardrobeBuilder(props) {
  const { viewProps, applicationContentProps } =
    useWardrobeBuilderViewModel(props);

  return (
    <>
      <WardrobeBuilderView {...viewProps} />
      {applicationContentProps.activePickerEntry ? (
        <OutfitPickerModal
          selectedOutfitId={
            applicationContentProps.activePickerEntry.outfitCreationId
          }
          onClose={applicationContentProps.closeOutfitPicker}
          onSelect={applicationContentProps.handleSelectOutfit}
        />
      ) : null}
    </>
  );
}
