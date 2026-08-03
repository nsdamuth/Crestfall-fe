"use client";

import StoryRoomNpcParticipantManagerView from "./story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view";
import { useStoryRoomNpcParticipantManagerViewModel } from "./story-room-npc-participant-manager/useStoryRoomNpcParticipantManagerViewModel";

export default function StoryRoomNpcParticipantManager(props) {
  const viewProps = useStoryRoomNpcParticipantManagerViewModel(props);

  return <StoryRoomNpcParticipantManagerView {...viewProps} />;
}
