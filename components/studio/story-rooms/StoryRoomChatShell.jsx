"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import StoryRoomCastPanel from "@/components/studio/story-rooms/StoryRoomCastPanel";
import StoryRoomComposer from "@/components/studio/story-rooms/StoryRoomComposer";
import StoryRoomMobileDrawer from "@/components/studio/story-rooms/StoryRoomMobileDrawer";
import StoryRoomRuntimeMechanicsPanel from "@/components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel";
import StoryRoomStatePanel from "@/components/studio/story-rooms/StoryRoomStatePanel";
import StoryRoomStatusSurfaceHost from "@/components/studio/story-rooms/story-room-chat-shell/StoryRoomStatusSurfaceHost";
import StoryRoomTranscript from "@/components/studio/story-rooms/StoryRoomTranscript";
import useStoryRoomChat from "@/components/studio/story-rooms/hooks/useStoryRoomChat";
import {
  isStoryPostCreateCharacterConfigurationRequired,
} from "@/lib/shared/story-rooms/storyPostCreateNavigation";
import {
  buildStoryCharacterConfigurationHref,
} from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

import StoryRoomChatShellView from "./story-room-chat-shell/StoryRoomChatShell.view";
import { useStoryRoomChatShellViewModel } from "./story-room-chat-shell/useStoryRoomChatShellViewModel";

export default function StoryRoomChatShell({ roomId }) {
  const router = useRouter();
  const chat = useStoryRoomChat(roomId);
  const account = useStudioAccount();

  useEffect(() => {
    if (!roomId || chat?.loading || !chat?.room) return;
    if (!isStoryPostCreateCharacterConfigurationRequired(chat.room)) return;

    const configurationHref = buildStoryCharacterConfigurationHref(roomId);
    if (configurationHref) router.replace(configurationHref);
  }, [chat?.loading, chat?.room, roomId, router]);

  const onRoomDeleted = useCallback(() => {
    router.push("/studio/v2/stories");
  }, [router]);

  const viewProps = useStoryRoomChatShellViewModel({
    roomId,
    chat,
    account,
    onRoomDeleted,
  });

  return (
    <>
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

      {viewProps.playerCharacterPickerProps ? (
        <DefaultPlayerCharacterPickerModal
          {...viewProps.playerCharacterPickerProps}
        />
      ) : null}
    </>
  );
}
