"use client";

import PoseIdentitySectionView from "./pose-identity-section/PoseIdentitySection.view";
import { usePoseIdentitySectionViewModel } from "./pose-identity-section/usePoseIdentitySectionViewModel";

export default function PoseIdentitySection(props) {
  const viewProps = usePoseIdentitySectionViewModel(props);

  return <PoseIdentitySectionView {...viewProps} />;
}
