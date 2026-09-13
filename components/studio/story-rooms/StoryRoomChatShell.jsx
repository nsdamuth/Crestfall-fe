"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { useStudioChrome } from "@/components/studio/StudioChromeProvider";
import StoryRoomComposer from "@/components/studio/story-rooms/StoryRoomComposer";
import StoryRoomDetailsRail from "@/components/studio/story-rooms/StoryRoomDetailsRail";
import StoryLaunchRequirementsSheet from "@/components/studio/story-rooms/StoryLaunchRequirementsSheet";
import StoryRoomStatusSurfaceHost from "@/components/studio/story-rooms/story-room-chat-shell/StoryRoomStatusSurfaceHost";
import StoryRoomStoryList from "@/components/studio/story-rooms/StoryRoomStoryList";
import StoryRoomTranscript from "@/components/studio/story-rooms/StoryRoomTranscript";
import { useStoryLaunchController } from "@/components/studio/story-rooms/hooks/useStoryLaunchController";
import useStoryRoomChat from "@/components/studio/story-rooms/hooks/useStoryRoomChat";

import StoryRoomChatShellView from "./story-room-chat-shell/StoryRoomChatShell.view";
import { useStoryRoomChatShellViewModel } from "./story-room-chat-shell/useStoryRoomChatShellViewModel";

// The cast panel, state panel, and runtime mechanics panel reach the
// page through StoryRoomDetailsRail's own binding (item 6).
export default function StoryRoomChatShell({ roomId }) {
  const router = useRouter();
  const chat = useStoryRoomChat(roomId);
  const account = useStudioAccount();
  // One left panel at a time: the story list rail claims the left edge
  // through the studio chrome context and the primary nav collapses.
  const chrome = useStudioChrome();
  // New chat (brief 4 item 3): the same launch controller the Stories
  // page uses (prepare, the requirements sheet when a choice is needed,
  // POST from-template or POST story-rooms, then navigate to the new
  // chat through the post-create route authority).
  const launchController = useStoryLaunchController();

  const onRoomDeleted = useCallback(() => {
    router.push("/studio/v2/stories");
  }, [router]);

  const viewProps = useStoryRoomChatShellViewModel({
    roomId,
    chat,
    account,
    onRoomDeleted,
    chrome,
    newChatLaunch: launchController,
  });

  return (
    <>
      <StoryRoomChatShellView
        {...viewProps}
        ComposerComponent={StoryRoomComposer}
        DetailsRailComponent={StoryRoomDetailsRail}
        StatusSurfaceHostComponent={StoryRoomStatusSurfaceHost}
        StoryListComponent={StoryRoomStoryList}
        TranscriptComponent={StoryRoomTranscript}
        LinkComponent={Link}
      />

      {viewProps.playerCharacterPickerProps ? (
        <DefaultPlayerCharacterPickerModal
          {...viewProps.playerCharacterPickerProps}
        />
      ) : null}

      <StoryLaunchRequirementsSheet picker={launchController.picker} />
    </>
  );
}
