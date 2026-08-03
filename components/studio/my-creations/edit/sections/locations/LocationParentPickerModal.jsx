"use client";

import LocationParentPickerModalView from "./location-parent-picker/LocationParentPickerModal.view";
import { useLocationParentPickerModalViewModel } from "./location-parent-picker/useLocationParentPickerModalViewModel";

export default function LocationParentPickerModal(props) {
  const viewProps = useLocationParentPickerModalViewModel(props);

  return <LocationParentPickerModalView {...viewProps} />;
}
