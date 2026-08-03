"use client";

import MechanicsPresetValidationPanelView from "./MechanicsPresetValidationPanel.view";
import { useMechanicsPresetValidationPanelViewModel } from "./useMechanicsPresetValidationPanelViewModel";

export default function MechanicsPresetValidationPanel(props) {
  const viewProps = useMechanicsPresetValidationPanelViewModel(props);
  return <MechanicsPresetValidationPanelView {...viewProps} />;
}
