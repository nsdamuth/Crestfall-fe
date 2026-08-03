"use client";

import MechanicsPresetApplicationModalView from "./MechanicsPresetApplicationModal.view";
import { useMechanicsPresetApplicationViewModel } from "./useMechanicsPresetApplicationViewModel";

export default function MechanicsPresetApplicationModal(props) {
  const viewProps = useMechanicsPresetApplicationViewModel(props);
  return <MechanicsPresetApplicationModalView {...viewProps} />;
}
