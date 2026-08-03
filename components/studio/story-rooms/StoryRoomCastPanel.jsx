"use client";

import Link from "next/link";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";

import StoryRoomCastPanelView from "./story-room-cast-panel/StoryRoomCastPanel.view";
import { useStoryRoomCastPanelViewModel } from "./story-room-cast-panel/useStoryRoomCastPanelViewModel";

export default function StoryRoomCastPanel(props) {
  const { viewProps, playerCharacterPickerProps } =
    useStoryRoomCastPanelViewModel(props);

  const playerCharacterPickerContent = playerCharacterPickerProps ? (
    <DefaultPlayerCharacterPickerModal {...playerCharacterPickerProps} />
  ) : null;

  return (
    <StoryRoomCastPanelView
      {...viewProps}
      playerCharacterPickerContent={playerCharacterPickerContent}
      LinkComponent={Link}
    />
  );
}
