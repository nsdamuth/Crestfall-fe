"use client";

import { useCallback, useMemo, useState } from "react";

export const STORY_ROOM_DETAILS_ROWS = Object.freeze([
  { id: "cast", label: "Cast" },
  { id: "narrator", label: "Narrator" },
  { id: "world", label: "World state" },
  { id: "mechanics", label: "Mechanics" },
  { id: "preferences", label: "Preferences" },
]);

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function humanizeChip(value) {
  const text = normalizeText(value);
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// The story's media set (fe/chat-studio item 6, interim until CR-069
// serves a list): the featured speaker image first, then every cast
// member's media images and avatar, then every scene image the
// transcript carries, deduplicated by url in first-seen order.
export function buildStoryMediaItems({ room = {}, cast = [], messages = [] } = {}) {
  const items = [];
  const seen = new Set();

  function push(url, altText, sourceLabel) {
    const safeUrl = normalizeText(url);
    if (!safeUrl || seen.has(safeUrl)) return;
    seen.add(safeUrl);
    items.push({
      id: `media-${items.length + 1}`,
      url: safeUrl,
      altText: normalizeText(altText) || "Story image",
      sourceLabel: normalizeText(sourceLabel),
    });
  }

  push(room?.featuredSpeakerImageUrl, room?.featuredSpeakerName, room?.featuredSpeakerName);

  for (const member of Array.isArray(cast) ? cast : []) {
    const name = normalizeText(member?.name);
    for (const url of Array.isArray(member?.mediaImageUrls) ? member.mediaImageUrls : []) {
      push(url, name, name);
    }
    push(member?.avatarUrl, name, name);
  }

  for (const message of Array.isArray(messages) ? messages : []) {
    const media = message?.metadata?.autoEventMedia;
    if (media?.displayUrl) {
      push(media.displayUrl, media.canonicalName || message?.speaker, "Scene");
    }
  }

  return items;
}

export function useStoryRoomDetailsRailViewModel({
  room = {},
  cast = [],
  messages = [],
  chatColorProps = null,
  onDeleteRoom = null,
  isDeletingRoom = false,
  deleteError = "",
  autoOpenViewer = false,
} = {}) {
  const mediaItems = useMemo(
    () => buildStoryMediaItems({ room, cast, messages }),
    [room, cast, messages]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(() =>
    autoOpenViewer && mediaItems.length ? 0 : null
  );
  const [activeDetail, setActiveDetail] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const count = mediaItems.length;
  const safeActiveIndex = count ? Math.min(activeIndex, count - 1) : 0;

  const step = useCallback(
    (from, delta) => (count ? (from + delta + count) % count : 0),
    [count]
  );

  const openDetail = useCallback((id) => {
    setActiveDetail(STORY_ROOM_DETAILS_ROWS.some((row) => row.id === id) ? id : null);
  }, []);

  const chips = [
    room?.contentRating ? { id: "rating", label: humanizeChip(room.contentRating) } : null,
    room?.visibility ? { id: "visibility", label: humanizeChip(room.visibility) } : null,
  ].filter(Boolean);

  return {
    title: normalizeText(room?.title) || "Untitled story",
    chips,
    // The Chassis serves no creator name and no description on the room
    // snapshot (CR-067, CR-068); both stay hidden until they arrive.
    byline: null,
    description: "",
    descriptionExpanded,
    onToggleDescription: () => setDescriptionExpanded((value) => !value),
    narratorLabel: normalizeText(room?.narrator) || "Crestfall Engine",
    gallery: {
      items: mediaItems,
      activeIndex: safeActiveIndex,
      onSelect: (index) => setActiveIndex(Math.max(0, Math.min(index, count - 1))),
      onPrevious: () => setActiveIndex((current) => step(current, -1)),
      onNext: () => setActiveIndex((current) => step(current, 1)),
      viewerIndex: count && viewerIndex !== null ? Math.min(viewerIndex, count - 1) : null,
      onOpenViewer: (index) => setViewerIndex(Math.max(0, Math.min(index ?? safeActiveIndex, count - 1))),
      onCloseViewer: () => setViewerIndex(null),
      onViewerPrevious: () => setViewerIndex((current) => step(current ?? 0, -1)),
      onViewerNext: () => setViewerIndex((current) => step(current ?? 0, 1)),
    },
    menu: {
      open: menuOpen,
      onToggle: () => setMenuOpen((value) => !value),
      onClose: () => setMenuOpen(false),
      items: typeof onDeleteRoom === "function"
        ? [
            {
              id: "delete",
              label: isDeletingRoom ? "Deleting" : "Delete story",
              tone: "danger",
              disabled: Boolean(isDeletingRoom),
              onSelect: () => {
                setMenuOpen(false);
                onDeleteRoom?.();
              },
            },
          ]
        : [],
    },
    deleteError: normalizeText(deleteError),
    rows: STORY_ROOM_DETAILS_ROWS,
    activeDetail,
    onOpenDetail: openDetail,
    onBack: () => setActiveDetail(null),
    chatColor: chatColorProps || null,
  };
}
