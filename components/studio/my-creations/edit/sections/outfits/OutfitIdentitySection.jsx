"use client";

import OutfitIdentitySectionView from "./outfit-identity-section/OutfitIdentitySection.view";
import { useOutfitIdentitySectionViewModel } from "./outfit-identity-section/useOutfitIdentitySectionViewModel";

export default function OutfitIdentitySection(props) {
  const viewProps = useOutfitIdentitySectionViewModel(props);

  return <OutfitIdentitySectionView {...viewProps} />;
}
