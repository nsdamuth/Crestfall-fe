"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import StoryRoomChatC1C6Binding from "@/components/studio/story-rooms/story-room-chat-c1-c6-binding/StoryRoomChatC1C6Binding";
import useStoryRoomChat from "@/components/studio/story-rooms/hooks/useStoryRoomChat";

export default function StoryRoomChatShell({ roomId }) {
  const router = useRouter();
  const chat = useStoryRoomChat(roomId);
  const { coinBalance } = useStudioAccount();

  const onRoomDeleted = useCallback(() => {
    router.push("/studio/story-rooms");
  }, [router]);

  return (
    <StoryRoomChatC1C6Binding
      roomId={roomId}
      chat={chat}
      coinBalance={coinBalance}
      onRoomDeleted={onRoomDeleted}
    />
  );
}
