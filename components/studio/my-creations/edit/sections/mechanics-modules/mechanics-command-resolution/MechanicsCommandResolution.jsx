"use client";

import MechanicsCommandResolutionView from "./MechanicsCommandResolution.view.jsx";
import useMechanicsCommandResolutionViewModel from "./useMechanicsCommandResolutionViewModel.js";

export default function MechanicsCommandResolution(props) {
  const viewModel = useMechanicsCommandResolutionViewModel(props);
  return <MechanicsCommandResolutionView {...viewModel} />;
}
