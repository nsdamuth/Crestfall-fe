"use client";

import ScenarioStoryCircleSectionView from "./scenario-story-circle-section/ScenarioStoryCircleSection.view";
import { useScenarioStoryCircleSectionViewModel } from "./scenario-story-circle-section/useScenarioStoryCircleSectionViewModel";

export default function ScenarioStoryCircleSection(props) {
  const viewProps = useScenarioStoryCircleSectionViewModel(props);

  return <ScenarioStoryCircleSectionView {...viewProps} />;
}
