"use client";

import ScenarioRuntimeGuidanceSectionView from "./scenario-runtime-guidance-section/ScenarioRuntimeGuidanceSection.view";
import { useScenarioRuntimeGuidanceSectionViewModel } from "./scenario-runtime-guidance-section/useScenarioRuntimeGuidanceSectionViewModel";

export default function ScenarioRuntimeGuidanceSection(props) {
  const viewProps = useScenarioRuntimeGuidanceSectionViewModel(props);

  return <ScenarioRuntimeGuidanceSectionView {...viewProps} />;
}
