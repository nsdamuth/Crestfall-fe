"use client";

import MechanicsDefaultsView from "./MechanicsDefaults.view.jsx";
import useMechanicsDefaultsViewModel from "./useMechanicsDefaultsViewModel.js";

export default function MechanicsDefaults(props) {
  const viewModel = useMechanicsDefaultsViewModel(props);
  return <MechanicsDefaultsView {...viewModel} />;
}
