"use client";

import OutfitMaterialsDetailsSectionView from "./outfit-materials-details-section/OutfitMaterialsDetailsSection.view";
import { useOutfitMaterialsDetailsSectionViewModel } from "./outfit-materials-details-section/useOutfitMaterialsDetailsSectionViewModel";

export default function OutfitMaterialsDetailsSection(props) {
  const viewProps = useOutfitMaterialsDetailsSectionViewModel(props);

  return <OutfitMaterialsDetailsSectionView {...viewProps} />;
}
