"use client";

import Link from "next/link";

import StoryCharacterConfigurationView from "./StoryCharacterConfiguration.view";
import { useStoryCharacterConfigurationViewModel } from "./useStoryCharacterConfigurationViewModel";

export default function StoryCharacterConfigurationShell({ roomId } = {}) {
  const viewModel = useStoryCharacterConfigurationViewModel({ roomId });

  return (
    <StoryCharacterConfigurationView
      {...viewModel}
      InternalLinkComponent={Link}
    />
  );
}
