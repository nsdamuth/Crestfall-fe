"use client";

import LocationPromptGuidanceSectionView from "./location-prompt-guidance-section/LocationPromptGuidanceSection.view";
import { useLocationPromptGuidanceSectionViewModel } from "./location-prompt-guidance-section/useLocationPromptGuidanceSectionViewModel";

export default function LocationPromptGuidanceSection(props) {
  const viewProps = useLocationPromptGuidanceSectionViewModel(props);

  return <LocationPromptGuidanceSectionView {...viewProps} />;
}
