"use client";

import LocationParentPickerModal from "@/components/studio/my-creations/edit/sections/locations/LocationParentPickerModal";
import LocationIdentitySectionView from "./location-identity-section/LocationIdentitySection.view";
import { useLocationIdentitySectionViewModel } from "./location-identity-section/useLocationIdentitySectionViewModel";

export default function LocationIdentitySection(props) {
  const {
    viewProps,
    isParentPickerOpen,
    parentPickerProps,
  } = useLocationIdentitySectionViewModel(props);

  return (
    <>
      <LocationIdentitySectionView {...viewProps} />

      {isParentPickerOpen ? (
        <LocationParentPickerModal {...parentPickerProps} />
      ) : null}
    </>
  );
}
