"use client";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";
import ChatShell from "@/components/studio/chat/ChatShell";
import StoryRoomRuntimeMechanicsPanel from "@/components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel";

import StoryRoomChatComposerHelpOverlay from "./StoryRoomChatComposerHelpOverlay";
import { useStoryRoomChatC1C6BindingViewModel } from "./useStoryRoomChatC1C6BindingViewModel";

export default function StoryRoomChatC1C6Binding(props) {
  const {
    shellProps,
    playerCharacterPickerProps,
    runtimeMechanicsPanelProps,
    composerHelpPanel,
    commands,
    onCloseComposerHelpPanel,
  } = useStoryRoomChatC1C6BindingViewModel(props);

  const playerCharacterPickerContent = playerCharacterPickerProps ? (
    <DefaultPlayerCharacterPickerModal {...playerCharacterPickerProps} />
  ) : null;

  const runtimeMechanicsPanelContent = runtimeMechanicsPanelProps ? (
    <StoryRoomRuntimeMechanicsPanel {...runtimeMechanicsPanelProps} />
  ) : null;

  const boundShellProps = {
    ...shellProps,
    castPanel: {
      ...shellProps.castPanel,
      playerCharacterPickerContent,
    },
    statePanel: {
      ...shellProps.statePanel,
      supplementalContent: runtimeMechanicsPanelContent,
    },
  };

  return (
    <>
      <ChatShell {...boundShellProps} />
      <StoryRoomChatComposerHelpOverlay
        panel={composerHelpPanel}
        commands={commands}
        onClose={onCloseComposerHelpPanel}
      />
    </>
  );
}
