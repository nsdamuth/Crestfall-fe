"use client";

import ScenarioIdentitySectionView from "./scenario-identity-section/ScenarioIdentitySection.view";
import { useScenarioIdentitySectionViewModel } from "./scenario-identity-section/useScenarioIdentitySectionViewModel";

export default function ScenarioIdentitySection(props) {
  const viewProps = useScenarioIdentitySectionViewModel(props);

  return <ScenarioIdentitySectionView {...viewProps} />;
}
