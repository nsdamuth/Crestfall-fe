"use client";

import OutfitPickerModal from "@/components/studio/create/wardrobe/OutfitPickerModal";

import DefaultClothingSelectorView from "./default-clothing-selector/DefaultClothingSelector.view";
import { useDefaultClothingSelectorViewModel } from "./default-clothing-selector/useDefaultClothingSelectorViewModel";

export { getDefaultClothingInitialFields } from "./default-clothing-selector/useDefaultClothingSelectorViewModel";

export default function DefaultClothingSelector(props) {
  const { viewProps, pickerProps } = useDefaultClothingSelectorViewModel(props);

  return (
    <>
      <DefaultClothingSelectorView {...viewProps} />
      {pickerProps ? <OutfitPickerModal {...pickerProps} /> : null}
    </>
  );
}
