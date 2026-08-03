"use client";

import OutfitPromptGuidanceSectionView from "./outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view";
import { useOutfitPromptGuidanceSectionViewModel } from "./outfit-prompt-guidance-section/useOutfitPromptGuidanceSectionViewModel";

export default function OutfitPromptGuidanceSection(props) {
  const viewProps = useOutfitPromptGuidanceSectionViewModel(props);

  return <OutfitPromptGuidanceSectionView {...viewProps} />;
}
