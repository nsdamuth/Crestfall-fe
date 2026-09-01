"use client";

import StoryRoomChatShell from "@/components/studio/story-rooms/StoryRoomChatShell";

/**
 * Canonical V2 Story Chat binding.
 *
 * StoryRoomChatShell is the established live Story Room implementation and is
 * intentionally mounted intact here. Do not rebuild a parallel V2 chat stack;
 * future Story Chat behavior belongs in components/studio/story-rooms/**.
 */
export default function StoryChatPage({ id }) {
  return <StoryRoomChatShell roomId={id} />;
}
