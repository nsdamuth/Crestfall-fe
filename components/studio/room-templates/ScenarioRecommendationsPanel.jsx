"use client";

import ScenarioRecommendationsPanelView from "./scenario-recommendations-panel/ScenarioRecommendationsPanel.view";
import { useScenarioRecommendationsPanelViewModel } from "./scenario-recommendations-panel/useScenarioRecommendationsPanelViewModel";

export default function ScenarioRecommendationsPanel(props) {
  const viewProps = useScenarioRecommendationsPanelViewModel(props);

  return <ScenarioRecommendationsPanelView {...viewProps} />;
}
