"use client";

import StoryRoomMessageView from "./story-room-message/StoryRoomMessage.view";
import { useStoryRoomMessageViewModel } from "./story-room-message/useStoryRoomMessageViewModel";

export default function StoryRoomMessage(props) {
  const viewProps = useStoryRoomMessageViewModel(props);

  return <StoryRoomMessageView {...viewProps} />;
}
