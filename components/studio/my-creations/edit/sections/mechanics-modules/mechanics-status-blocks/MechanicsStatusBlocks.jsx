"use client";

import MechanicsStatusBlocksView from "./MechanicsStatusBlocks.view.jsx";
import useMechanicsStatusBlocksViewModel from "./useMechanicsStatusBlocksViewModel.js";

export default function MechanicsStatusBlocks(props) {
  const viewModel = useMechanicsStatusBlocksViewModel(props);
  return <MechanicsStatusBlocksView {...viewModel} />;
}
