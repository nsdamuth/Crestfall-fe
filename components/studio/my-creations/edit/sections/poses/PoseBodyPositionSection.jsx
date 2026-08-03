"use client";

import PoseBodyPositionSectionView from "./pose-body-position-section/PoseBodyPositionSection.view";
import { usePoseBodyPositionSectionViewModel } from "./pose-body-position-section/usePoseBodyPositionSectionViewModel";

export default function PoseBodyPositionSection(props) {
  const viewProps = usePoseBodyPositionSectionViewModel(props);

  return <PoseBodyPositionSectionView {...viewProps} />;
}
