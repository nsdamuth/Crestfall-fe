"use client";

import Link from "next/link";

import ViewModeToggle from "@/components/studio/ViewModeToggle";

import StoryRoomsHubView from "./story-rooms-hub/StoryRoomsHub.view";
import { useStoryRoomsHubViewModel } from "./story-rooms-hub/useStoryRoomsHubViewModel";

export default function StoryRoomsHub(props) {
  const viewProps = useStoryRoomsHubViewModel(props);

  return (
    <StoryRoomsHubView
      {...viewProps}
      InternalLinkComponent={Link}
      ViewModeToggleComponent={ViewModeToggle}
    />
  );
}
