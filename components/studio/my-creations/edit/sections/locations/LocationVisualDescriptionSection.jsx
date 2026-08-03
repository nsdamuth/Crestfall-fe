"use client";

import LocationVisualDescriptionSectionView from "./location-visual-description-section/LocationVisualDescriptionSection.view";
import { useLocationVisualDescriptionSectionViewModel } from "./location-visual-description-section/useLocationVisualDescriptionSectionViewModel";

export default function LocationVisualDescriptionSection(props) {
  const viewProps = useLocationVisualDescriptionSectionViewModel(props);

  return <LocationVisualDescriptionSectionView {...viewProps} />;
}
