"use client";

import ScenarioMiddlewareSectionView from "./scenario-middleware-section/ScenarioMiddlewareSection.view";
import { useScenarioMiddlewareSectionViewModel } from "./scenario-middleware-section/useScenarioMiddlewareSectionViewModel";

export default function ScenarioMiddlewareSection(props) {
  const viewProps = useScenarioMiddlewareSectionViewModel(props);

  return <ScenarioMiddlewareSectionView {...viewProps} />;
}
