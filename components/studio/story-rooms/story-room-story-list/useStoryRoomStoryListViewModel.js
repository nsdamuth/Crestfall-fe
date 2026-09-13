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
export const STORY_ROOM_STORY_LIST_MOBILE_PAGE_SIZE = 10;
export const STORY_ROOM_STORY_LIST_DESKTOP_PAGE_SIZE = 25;
export const STORY_ROOM_STORY_LIST_DESKTOP_QUERY = "(min-width: 48rem)";

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
  newChat = null,
} = {}) {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchRooms, setSearchRooms] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia(STORY_ROOM_STORY_LIST_DESKTOP_QUERY).matches
      ? STORY_ROOM_STORY_LIST_DESKTOP_PAGE_SIZE
      : STORY_ROOM_STORY_LIST_MOBILE_PAGE_SIZE
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(STORY_ROOM_STORY_LIST_DESKTOP_QUERY);
    const onChange = (event) => {
      setPageSize(
        event.matches
          ? STORY_ROOM_STORY_LIST_DESKTOP_PAGE_SIZE
          : STORY_ROOM_STORY_LIST_MOBILE_PAGE_SIZE
      );
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setSearchRooms(null);
      try {
        const nextRooms = await loadStoryRooms({
          limit: pageSize + 1,
          offset: 0,
        });
        if (cancelled) return;
        const safeRooms = Array.isArray(nextRooms) ? nextRooms : [];
        setRooms(safeRooms.slice(0, pageSize));
        setHasMore(safeRooms.length > pageSize);
        setErrorMessage("");
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;
        setRooms([]);
        setHasMore(false);
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
  }, [loadStoryRooms, pageSize, refetchKey]);

  const normalizedQuery = normalizeText(query);

  // Search keeps full-list semantics without making every normal sidebar open
  // expensive. We fetch the complete owned-room list only after the user
  // actually enters a query, then reuse it until the room list refetches.
  useEffect(() => {
    if (!normalizedQuery || searchRooms !== null) return undefined;

    let cancelled = false;

    async function loadSearchRooms() {
      setIsSearching(true);
      try {
        const nextRooms = await loadStoryRooms();
        if (cancelled) return;
        setSearchRooms(Array.isArray(nextRooms) ? nextRooms : []);
      } catch {
        if (cancelled) return;
        // Keep the already-loaded page searchable if the exhaustive search
        // fetch fails; the normal list error state should not be replaced.
        setSearchRooms([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }

    void loadSearchRooms();

    return () => {
      cancelled = true;
    };
  }, [loadStoryRooms, normalizedQuery, searchRooms]);

  const onLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || normalizedQuery) return;

    setIsLoadingMore(true);
    try {
      const nextRooms = await loadStoryRooms({
        limit: pageSize + 1,
        offset: rooms.length,
      });
      const safeRooms = Array.isArray(nextRooms) ? nextRooms : [];
      const pageRooms = safeRooms.slice(0, pageSize);

      setRooms((current) => {
        const seen = new Set(current.map((room) => String(room?.id || "")));
        const appended = pageRooms.filter((room) => {
          const id = String(room?.id || "");
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        return [...current, ...appended];
      });
      setHasMore(safeRooms.length > pageSize);
    } catch (error) {
      setErrorMessage(
        error?.message || STORY_ROOM_STORY_LIST_COPY.loadErrorFallback
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, loadStoryRooms, normalizedQuery, pageSize, rooms.length]);

  const sourceRooms = normalizedQuery && searchRooms !== null ? searchRooms : rooms;
  const items = useMemo(
    () => projectStoryRoomsToListItems(sourceRooms, { currentRoomId }),
    [sourceRooms, currentRoomId]
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
    // New chat (brief 4 item 3) arrives display-ready from the chat
    // shell, which owns the launch; null hides the button.
    newChat: newChat && typeof newChat === "object" ? newChat : null,
    isLoading: status === "loading" || Boolean(normalizedQuery && isSearching),
    isLoadingMore,
    hasMore: !normalizedQuery && hasMore,
    onLoadMore,
    loadMoreLabel: "Load more",
    errorMessage: status === "error" ? errorMessage : "",
    onSelect,
  };
}
