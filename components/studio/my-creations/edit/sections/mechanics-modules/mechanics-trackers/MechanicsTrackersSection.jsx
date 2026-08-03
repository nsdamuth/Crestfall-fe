"use client";

import MechanicsTrackersSectionView from "./MechanicsTrackersSection.view";
import { useMechanicsTrackersViewModel } from "./useMechanicsTrackersViewModel";

export default function MechanicsTrackersSection(props) {
  const viewModel = useMechanicsTrackersViewModel(props);
  return <MechanicsTrackersSectionView {...viewModel} />;
}
