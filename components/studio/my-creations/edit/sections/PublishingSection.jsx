"use client";

import CreationPublishingSectionView from "@/components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view";
import { useCreationPublishingSectionViewModel } from "@/components/studio/my-creations/edit/sections/creation-publishing-section/useCreationPublishingSectionViewModel";

export default function PublishingSection(props) {
  const viewProps = useCreationPublishingSectionViewModel(props);

  return <CreationPublishingSectionView {...viewProps} />;
}
