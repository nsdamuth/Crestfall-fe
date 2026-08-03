"use client";

import PoseMotionStagingSectionView from "./pose-motion-staging-section/PoseMotionStagingSection.view";
import { usePoseMotionStagingSectionViewModel } from "./pose-motion-staging-section/usePoseMotionStagingSectionViewModel";

export default function PoseMotionStagingSection(props) {
  const viewProps = usePoseMotionStagingSectionViewModel(props);

  return <PoseMotionStagingSectionView {...viewProps} />;
}
