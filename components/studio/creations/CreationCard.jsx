"use client";

import Link from "next/link";

import CreationPreviewModal from "./CreationPreviewModal";
import StoryLaunchRequirementsSheet from "@/components/studio/story-rooms/StoryLaunchRequirementsSheet";
import { useStoryLaunchController } from "@/components/studio/story-rooms/hooks/useStoryLaunchController";
import CreationCardView from "./creation-card/CreationCard.view";
import { useCreationCardViewModel } from "./creation-card/useCreationCardViewModel";

export default function CreationCard(props) {
  const launchController = useStoryLaunchController();
  const { cardViewProps, previewModalProps } = useCreationCardViewModel({
    ...props,
    onStartStory: launchController.launch,
    storyLaunchError: launchController.launchError,
  });

  return (
    <>
      <CreationCardView {...cardViewProps} LinkComponent={Link} />
      {previewModalProps ? <CreationPreviewModal {...previewModalProps} /> : null}
      <StoryLaunchRequirementsSheet picker={launchController.picker} />
    </>
  );
}
