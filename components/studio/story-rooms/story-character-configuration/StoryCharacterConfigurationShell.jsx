"use client";

import Link from "next/link";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";
import StoryCharacterConfigurationView from "./StoryCharacterConfiguration.view";
import { useStoryCharacterConfigurationViewModel } from "./useStoryCharacterConfigurationViewModel";

export default function StoryCharacterConfigurationShell({ roomId } = {}) {
  const viewModel = useStoryCharacterConfigurationViewModel({ roomId });

  return (
    <>
      <StoryCharacterConfigurationView
        {...viewModel}
        InternalLinkComponent={Link}
      />

      {viewModel.playerCharacterPickerProps ? (
        <DefaultPlayerCharacterPickerModal
          {...viewModel.playerCharacterPickerProps}
        />
      ) : null}
    </>
  );
}
