"use client";

import ChatSessionDialogs from "@/components/studio/chat/ChatSessionDialogs";
import StoryRoomStatePanelView from "./story-room-state-panel/StoryRoomStatePanel.view";
import { useStoryRoomStatePanelViewModel } from "./story-room-state-panel/useStoryRoomStatePanelViewModel";

export default function StoryRoomStatePanel(props) {
  const { sessionDialogs, ...viewProps } = useStoryRoomStatePanelViewModel(props);

  return (
    <>
      <StoryRoomStatePanelView {...viewProps} />
      <ChatSessionDialogs {...sessionDialogs} />
    </>
  );
}
