"use client";

import OutfitPickerModalView from "./outfit-picker/OutfitPickerModal.view";
import { useOutfitPickerModalViewModel } from "./outfit-picker/useOutfitPickerModalViewModel";

export default function OutfitPickerModal(props) {
  const viewProps = useOutfitPickerModalViewModel(props);

  return <OutfitPickerModalView {...viewProps} />;
}
