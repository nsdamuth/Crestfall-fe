"use client";

import CreationDangerSectionView from "@/components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view";
import { useCreationDangerSectionViewModel } from "@/components/studio/my-creations/edit/sections/creation-danger-section/useCreationDangerSectionViewModel";

export default function DangerSection(props) {
  const viewProps = useCreationDangerSectionViewModel(props);

  return <CreationDangerSectionView {...viewProps} />;
}
