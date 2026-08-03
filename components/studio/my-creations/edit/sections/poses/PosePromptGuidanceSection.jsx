"use client";

import PosePromptGuidanceSectionView from "./pose-prompt-guidance-section/PosePromptGuidanceSection.view";
import { usePosePromptGuidanceSectionViewModel } from "./pose-prompt-guidance-section/usePosePromptGuidanceSectionViewModel";

export default function PosePromptGuidanceSection(props) {
  const viewProps = usePosePromptGuidanceSectionViewModel(props);

  return <PosePromptGuidanceSectionView {...viewProps} />;
}
