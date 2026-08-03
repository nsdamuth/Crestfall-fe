"use client";

import ScenarioReferencePickerModalView from "./scenario-reference-picker/ScenarioReferencePickerModal.view";
import { useScenarioReferencePickerViewModel } from "./scenario-reference-picker/useScenarioReferencePickerViewModel";

export default function ScenarioReferencePickerModal(props) {
  const viewProps = useScenarioReferencePickerViewModel(props);

  return <ScenarioReferencePickerModalView {...viewProps} />;
}
