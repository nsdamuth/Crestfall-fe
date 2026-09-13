"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import StoryRoomStoryListView from "./story-room-story-list/StoryRoomStoryList.view";
import { useStoryRoomStoryListViewModel } from "./story-room-story-list/useStoryRoomStoryListViewModel";

export default function StoryRoomStoryList({ currentRoomId = "", refetchKey = 0, newChat = null }) {
  const router = useRouter();
  const onNavigate = useCallback((href) => router.push(href), [router]);
  const viewProps = useStoryRoomStoryListViewModel({
    currentRoomId,
    refetchKey,
    onNavigate,
    newChat,
  });

  return <StoryRoomStoryListView {...viewProps} LinkComponent={Link} />;
}
