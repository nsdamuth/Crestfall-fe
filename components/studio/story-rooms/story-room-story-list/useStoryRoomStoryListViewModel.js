"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchStoryRooms } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { projectStoryRoomToContinueItem } from "@/lib/shared/presentation/storiesPresentation";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";
import { formatStudioNotificationRelativeTime } from "@/components/studio/studio-top-bar/studioTopBarNotificationPresentation";

export const STORY_ROOM_STORY_LIST_COPY = Object.freeze({
  searchPlaceholder: "Search stories",
  newStoryLabel: "New story",
  recentHeading: "Recent",
  emptyMessage: "No stories yet.",
  loadErrorFallback: "Stories could not be loaded.",
});

export const STORY_ROOM_STORY_LIST_NEW_STORY_HREF = "/studio/v2/stories";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// The same list the Stories page reads (GET /api/studio/story-rooms
// through getStoriesPageData), fetched client-side here, projected
// with the Stories page's own projector so the title, last line, and
// recency match what the user saw on that page.
export function projectStoryRoomsToListItems(rooms = [], { currentRoomId = "", now = Date.now() } = {}) {
  const items = (Array.isArray(rooms) ? rooms : [])
    .map((room, index) => projectStoryRoomToContinueItem(room, index))
    .filter((item) => item && item.roomId)
    .map((item) => ({
      id: item.id,
      roomId: item.roomId,
      title: item.title,
      lastLine: normalizeText(item.description),
      relativeDay: item.lastPlayed
        ? formatStudioNotificationRelativeTime(item.lastPlayed, now)
        : "",
      imageSrc: item.imageSrc || null,
      isCurrent: String(item.roomId) === String(currentRoomId),
      href: buildStoryChatHref(item.roomId),
      recency: Number(item.recency) || 0,
    }));

  items.sort((a, b) => b.recency - a.recency);

  return items;
}

export function filterStoryListItems(items = [], query = "") {
  const needle = normalizeText(query).toLowerCase();
  if (!needle) return items;

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.lastLine.toLowerCase().includes(needle)
  );
}

export function useStoryRoomStoryListViewModel({
  currentRoomId = "",
  refetchKey = 0,
  onNavigate = null,
  loadStoryRooms = fetchStoryRooms,
} = {}) {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const nextRooms = await loadStoryRooms();
        if (cancelled) return;
        setRooms(Array.isArray(nextRooms) ? nextRooms : []);
        setErrorMessage("");
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;
        setRooms([]);
        setErrorMessage(
          error?.message || STORY_ROOM_STORY_LIST_COPY.loadErrorFallback
        );
        setStatus("error");
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadStoryRooms, refetchKey]);

  const items = useMemo(
    () => projectStoryRoomsToListItems(rooms, { currentRoomId }),
    [rooms, currentRoomId]
  );

  const filteredItems = useMemo(
    () => filterStoryListItems(items, query),
    [items, query]
  );

  const onSelect = useCallback(
    (roomId) => {
      const href = buildStoryChatHref(roomId);
      if (!href) return;
      onNavigate?.(href);
    },
    [onNavigate]
  );

  return {
    items: filteredItems,
    query,
    onQueryChange: (nextValue) => setQuery(String(nextValue ?? "")),
    newStoryHref: STORY_ROOM_STORY_LIST_NEW_STORY_HREF,
    isLoading: status === "loading",
    errorMessage: status === "error" ? errorMessage : "",
    onSelect,
  };
}
