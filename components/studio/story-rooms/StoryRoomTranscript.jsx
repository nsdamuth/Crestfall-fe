"use client";

import StoryRoomTranscriptView from "./story-room-transcript/StoryRoomTranscript.view";
import { useStoryRoomTranscriptViewModel } from "./story-room-transcript/useStoryRoomTranscriptViewModel";

export default function StoryRoomTranscript(props) {
  const viewProps = useStoryRoomTranscriptViewModel(props);

  return <StoryRoomTranscriptView {...viewProps} />;
}
