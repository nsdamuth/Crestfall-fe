"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchCreationPreview } from "@/lib/client/studio/creations/creationClient";

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

// The story's creation page (brief 3 item 4, the end card's View
// catalogue link): the room's source template when it started from one,
// else the default Character's creation, else any Character's creation;
// the same resolution the Stories page uses for a story's source.
export function resolveStoryCatalogueHref({ room = {}, cast = [] } = {}) {
  const rawRoom = room?.rawRoom || {};
  const source = rawRoom?.data?.source || {};
  const templateId = normalizeText(source.templateId || source.template_id);

  const members = Array.isArray(cast) ? cast : [];
  const isCharacter = (member) =>
    String(member?.participantType || "").toUpperCase() === "CHARACTER" &&
    normalizeText(member?.participant?.creationId);
  const defaultCharacter = members.find(
    (member) => isCharacter(member) && member?.participant?.isDefault
  );
  const anyCharacter = members.find(isCharacter);

  const creationId =
    templateId ||
    normalizeText(defaultCharacter?.participant?.creationId) ||
    normalizeText(anyCharacter?.participant?.creationId);

  return creationId ? `/studio/creations/${encodeURIComponent(creationId)}` : "";
}

// The source creation behind a story (brief 4 item 2): the template the
// room launched from, `room.data.source.templateId`; "" for a private
// character chat, which launched from no template.
export function resolveStorySourceTemplateId(room = {}) {
  const source = room?.rawRoom?.data?.source || {};
  return normalizeText(source.templateId || source.template_id);
}

// The description under the title (brief 4 item 2, interim until CR-068
// serves it on the room snapshot): read from the source creation
// through the existing preview client, fetchCreationPreview in
// lib/client/studio/creations/creationClient.js (GET
// /api/creations/{id}/preview, the Chassis GET /v1/creations/{id}/preview),
// whose `creation.description` is the served text. Hidden when the story
// has no source creation, and while the fetch is in flight or failed.
export function useStorySourceDescription(templateId = "", { loadPreview = fetchCreationPreview } = {}) {
  const [state, setState] = useState({ templateId: "", description: "" });

  useEffect(() => {
    if (!templateId) return undefined;

    let cancelled = false;

    async function load() {
      try {
        const preview = await loadPreview(templateId);
        if (cancelled) return;
        setState({
          templateId,
          description: normalizeText(preview?.creation?.description),
        });
      } catch {
        if (cancelled) return;
        setState({ templateId, description: "" });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadPreview, templateId]);

  return templateId && state.templateId === templateId ? state.description : "";
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
  const sourceTemplateId = resolveStorySourceTemplateId(room);
  const description = useStorySourceDescription(sourceTemplateId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(() =>
    autoOpenViewer && mediaItems.length ? 0 : null
  );
  const [activeDetail, setActiveDetail] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const count = mediaItems.length;
  const catalogueHref = useMemo(
    () => resolveStoryCatalogueHref({ room, cast }),
    [room, cast]
  );
  // The end card (brief 3 item 4) is one extra stop after the last image
  // when the story resolves to a creation page; the rail's page count is
  // the images plus that stop, and the viewer's is the images alone.
  const endCardIndex = catalogueHref && count ? count : null;
  const railStopCount = endCardIndex === null ? count : count + 1;
  const safeRailIndex = railStopCount ? Math.min(activeIndex, railStopCount - 1) : 0;
  const showEndCard = endCardIndex !== null && safeRailIndex === endCardIndex;
  const safeActiveIndex = showEndCard ? count - 1 : safeRailIndex;

  const step = useCallback(
    (from, delta) => (count ? (from + delta + count) % count : 0),
    [count]
  );
  const railStep = useCallback(
    (from, delta) =>
      railStopCount ? (from + delta + railStopCount) % railStopCount : 0,
    [railStopCount]
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
    // The Chassis serves no creator name on the room snapshot (CR-067);
    // the byline stays hidden until it arrives. The description reads
    // from the source creation's preview (brief 4 item 2) until CR-068
    // serves it on the snapshot.
    byline: null,
    description,
    descriptionExpanded,
    onToggleDescription: () => setDescriptionExpanded((value) => !value),
    narratorLabel: normalizeText(room?.narrator) || "Crestfall Engine",
    gallery: {
      items: mediaItems,
      activeIndex: safeActiveIndex,
      showEndCard,
      catalogueHref,
      onSelect: (index) => setActiveIndex(Math.max(0, Math.min(index, count - 1))),
      onPrevious: () => setActiveIndex((current) => railStep(current, -1)),
      onNext: () => setActiveIndex((current) => railStep(current, 1)),
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
