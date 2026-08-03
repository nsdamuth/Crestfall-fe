"use client";

import NarratorModulesSectionView from "./narrator-modules-section/NarratorModulesSection.view";
import { useNarratorModulesSectionViewModel } from "./narrator-modules-section/useNarratorModulesSectionViewModel";

export default function NarratorModulesSection(props) {
  const viewProps = useNarratorModulesSectionViewModel(props);

  return <NarratorModulesSectionView {...viewProps} />;
}
