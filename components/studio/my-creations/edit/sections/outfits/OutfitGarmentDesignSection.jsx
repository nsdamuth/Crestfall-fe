"use client";

import OutfitGarmentDesignSectionView from "./outfit-garment-design-section/OutfitGarmentDesignSection.view";
import { useOutfitGarmentDesignSectionViewModel } from "./outfit-garment-design-section/useOutfitGarmentDesignSectionViewModel";

export default function OutfitGarmentDesignSection(props) {
  const viewProps = useOutfitGarmentDesignSectionViewModel(props);

  return <OutfitGarmentDesignSectionView {...viewProps} />;
}
