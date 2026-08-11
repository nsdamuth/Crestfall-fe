"use client";

import KitPickerModalView from "./picker-modal/KitPickerModal.view";
import { useKitPickerModalViewModel } from "./picker-modal/useKitPickerModalViewModel";

export default function KitPickerModal(props) {
  const viewProps = useKitPickerModalViewModel(props);

  return <KitPickerModalView {...viewProps} />;
}
