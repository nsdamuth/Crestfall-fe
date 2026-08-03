"use client";

import MechanicsGuardsView from "./MechanicsGuards.view.jsx";
import useMechanicsGuardsViewModel from "./useMechanicsGuardsViewModel.js";

export default function MechanicsGuards(props) {
  const viewModel = useMechanicsGuardsViewModel(props);
  return <MechanicsGuardsView {...viewModel} />;
}
