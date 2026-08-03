"use client";

import StoryRoomComposerView from "./story-room-composer/StoryRoomComposer.view";
import { useStoryRoomComposerViewModel } from "./story-room-composer/useStoryRoomComposerViewModel";

export default function StoryRoomComposer(props) {
  const viewProps = useStoryRoomComposerViewModel(props);

  return <StoryRoomComposerView {...viewProps} />;
}
