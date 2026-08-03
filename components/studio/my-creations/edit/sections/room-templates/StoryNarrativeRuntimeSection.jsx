"use client";

import StoryNarrativeRuntimeSectionView from "./story-narrative-runtime-section/StoryNarrativeRuntimeSection.view";
import { useStoryNarrativeRuntimeSectionViewModel } from "./story-narrative-runtime-section/useStoryNarrativeRuntimeSectionViewModel";

export default function StoryNarrativeRuntimeSection(props) {
  const viewProps = useStoryNarrativeRuntimeSectionViewModel(props);

  return <StoryNarrativeRuntimeSectionView {...viewProps} />;
}
