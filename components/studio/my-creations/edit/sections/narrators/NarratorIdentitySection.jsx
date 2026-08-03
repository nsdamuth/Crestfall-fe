"use client";

import NarratorIdentitySectionView from "./narrator-identity-section/NarratorIdentitySection.view";
import { useNarratorIdentitySectionViewModel } from "./narrator-identity-section/useNarratorIdentitySectionViewModel";

export default function NarratorIdentitySection(props) {
  const viewProps = useNarratorIdentitySectionViewModel(props);

  return <NarratorIdentitySectionView {...viewProps} />;
}
