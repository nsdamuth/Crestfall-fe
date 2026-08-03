"use client";

import MechanicsCommandRequirementsView from "./MechanicsCommandRequirements.view.jsx";
import useMechanicsCommandRequirementsViewModel from "./useMechanicsCommandRequirementsViewModel.js";

export default function MechanicsCommandRequirements(props) {
  const viewModel = useMechanicsCommandRequirementsViewModel(props);
  return <MechanicsCommandRequirementsView {...viewModel} />;
}
