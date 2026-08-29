"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import StoryRoomCastPanel from "@/components/studio/story-rooms/StoryRoomCastPanel";
import StoryRoomComposer from "@/components/studio/story-rooms/StoryRoomComposer";
import StoryRoomMobileDrawer from "@/components/studio/story-rooms/StoryRoomMobileDrawer";
import StoryRoomRuntimeMechanicsPanel from "@/components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel";
import StoryRoomStatePanel from "@/components/studio/story-rooms/StoryRoomStatePanel";
import StoryRoomStatusSurfaceHost from "@/components/studio/story-rooms/story-room-chat-shell/StoryRoomStatusSurfaceHost";
import StoryRoomTranscript from "@/components/studio/story-rooms/StoryRoomTranscript";
import useStoryRoomChat from "@/components/studio/story-rooms/hooks/useStoryRoomChat";

import StoryRoomChatShellView from "./story-room-chat-shell/StoryRoomChatShell.view";
import { useStoryRoomChatShellViewModel } from "./story-room-chat-shell/useStoryRoomChatShellViewModel";

export default function StoryRoomChatShell({ roomId }) {
  const router = useRouter();
  const chat = useStoryRoomChat(roomId);

  const onRoomDeleted = useCallback(() => {
    router.push("/studio/story-rooms");
  }, [router]);

  const viewProps = useStoryRoomChatShellViewModel({
    roomId,
    chat,
    onRoomDeleted,
  });

  return (
    <StoryRoomChatShellView
      {...viewProps}
      CastPanelComponent={StoryRoomCastPanel}
      ComposerComponent={StoryRoomComposer}
      MobileDrawerComponent={StoryRoomMobileDrawer}
      RuntimeMechanicsPanelComponent={StoryRoomRuntimeMechanicsPanel}
      StatePanelComponent={StoryRoomStatePanel}
      StatusSurfaceHostComponent={StoryRoomStatusSurfaceHost}
      TranscriptComponent={StoryRoomTranscript}
    />
  );
}
