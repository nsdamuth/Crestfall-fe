"use client";

import MechanicsProgressionProfileFieldsView from "./MechanicsProgressionProfileFields.view";
import { useMechanicsProgressionProfileViewModel } from "./useMechanicsProgressionProfileViewModel";

export default function MechanicsProgressionProfileFields(props) {
  const viewModel = useMechanicsProgressionProfileViewModel(props);
  return <MechanicsProgressionProfileFieldsView {...viewModel} />;
}
