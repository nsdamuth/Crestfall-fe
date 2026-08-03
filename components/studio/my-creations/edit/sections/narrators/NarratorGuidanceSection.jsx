"use client";

import NarratorGuidanceSectionView from "./narrator-guidance-section/NarratorGuidanceSection.view";
import { useNarratorGuidanceSectionViewModel } from "./narrator-guidance-section/useNarratorGuidanceSectionViewModel";

export default function NarratorGuidanceSection(props) {
  const viewProps = useNarratorGuidanceSectionViewModel(props);

  return <NarratorGuidanceSectionView {...viewProps} />;
}
