"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchCreationPreview } from "@/lib/client/studio/creations/creationClient";
import { getCreationMediaDisplayUrl } from "@/lib/shared/creations/creationMedia";

// The gallery shows at most four images (review round 4 item 4), the
// same count as the community story slider (KitAssetDetailPopup caps
// its media at four), then the end card.
export const STORY_ROOM_GALLERY_MAX_IMAGES = 4;

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

// The right-rail gallery follows the latest Character/Narrator responder.
// The selected responder image is first, followed by that responder's
// remaining authored media. The stable participant id is authoritative;
// name matching is only a compatibility fallback for older snapshots.
export function buildLatestResponderMediaItems({ room = {}, cast = [] } = {}) {
  const items = [];
  const seen = new Set();
  const participantId = normalizeText(room?.featuredSpeakerParticipantId);
  const speakerName = normalizeText(room?.featuredSpeakerName);
  const members = Array.isArray(cast) ? cast : [];
  const member =
    members.find((candidate) => participantId && String(candidate?.id || "") === participantId) ||
    members.find((candidate) =>
      speakerName && normalizeText(candidate?.name).toLowerCase() === speakerName.toLowerCase()
    ) ||
    null;

  function push(url) {
    const safeUrl = normalizeText(url);
    if (!safeUrl || seen.has(safeUrl)) return;
    seen.add(safeUrl);
    items.push({
      id: `responder-media-${items.length + 1}`,
      url: safeUrl,
      altText: speakerName || normalizeText(member?.name) || "Latest responder",
      sourceLabel: speakerName || normalizeText(member?.name),
    });
  }

  push(room?.featuredSpeakerImageUrl);
  for (const url of Array.isArray(room?.featuredSpeakerMediaImageUrls)
    ? room.featuredSpeakerMediaImageUrls
    : []) {
    push(url);
  }
  for (const url of Array.isArray(member?.mediaImageUrls) ? member.mediaImageUrls : []) {
    push(url);
  }
  push(room?.featuredSpeakerAvatarUrl);
  push(member?.avatarUrl);

  return items.slice(0, STORY_ROOM_GALLERY_MAX_IMAGES);
}

// Story-scene media is the fallback when the latest responder has no usable
// authored image collection (for example a Narrator without custom media).
// It intentionally does not merge every cast member into one gallery.
export function buildStoryMediaItems({ room = {}, messages = [] } = {}) {
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

  const openingHero = room?.openingHeroImage;
  push(
    openingHero?.displayUrl || openingHero?.url,
    openingHero?.altText || room?.title,
    "Opening scene"
  );

  for (const message of Array.isArray(messages) ? messages : []) {
    const media = message?.metadata?.autoEventMedia;
    if (media?.displayUrl) {
      push(media.displayUrl, media.canonicalName || message?.speaker, "Scene");
    }
  }

  return items;
}

// The story's catalogue creation (brief 3 item 4, the end card's View
// catalogue link; review round 4 item 4, the gallery's fallback media):
// the room's source template when it started from one, else the default
// Character's creation, else any Character's creation; the same
// resolution the Stories page uses for a story's source.
export function resolveStoryCatalogueCreationId({ room = {}, cast = [] } = {}) {
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

  return (
    templateId ||
    normalizeText(defaultCharacter?.participant?.creationId) ||
    normalizeText(anyCharacter?.participant?.creationId)
  );
}

export function resolveStoryCatalogueHref({ room = {}, cast = [] } = {}) {
  const creationId = resolveStoryCatalogueCreationId({ room, cast });
  return creationId ? `/studio/creations/${encodeURIComponent(creationId)}` : "";
}

// The catalogue creation's own images (review round 4 item 4), read
// from the preview's `creation.featuredMedia` through the same shared
// url helper the community story slider uses, in served order.
export function projectPreviewFeaturedMedia(preview = null, { altText = "" } = {}) {
  const featured = Array.isArray(preview?.creation?.featuredMedia)
    ? preview.creation.featuredMedia
    : [];

  return featured
    .map((entry, index) => {
      const url = normalizeText(getCreationMediaDisplayUrl(entry));
      if (!url) return null;
      return {
        id: normalizeText(entry?.id) || `catalogue-media-${index + 1}`,
        url,
        altText: normalizeText(entry?.title) || normalizeText(altText) || "Story image",
        sourceLabel: normalizeText(altText),
      };
    })
    .filter(Boolean);
}

// The source creation behind a story (brief 4 item 2): the template the
// room launched from, `room.data.source.templateId`; "" for a private
// character chat, which launched from no template.
export function resolveStorySourceTemplateId(room = {}) {
  const source = room?.rawRoom?.data?.source || {};
  return normalizeText(source.templateId || source.template_id);
}

// The catalogue creation's preview (brief 4 item 2 and review round 4
// item 4): one fetch through the existing preview client,
// fetchCreationPreview in lib/client/studio/creations/creationClient.js
// (GET /api/creations/{id}/preview, the Chassis GET
// /v1/creations/{id}/preview). It feeds the description under the title
// (`creation.description`, interim until CR-068) and the gallery's
// fallback images (`creation.featuredMedia`, interim until CR-069).
// Null while the fetch is in flight, failed, or for another creation.
export function useStoryCataloguePreview(creationId = "", { loadPreview = fetchCreationPreview } = {}) {
  const [state, setState] = useState({ creationId: "", preview: null });

  useEffect(() => {
    if (!creationId) return undefined;

    let cancelled = false;

    async function load() {
      try {
        const preview = await loadPreview(creationId);
        if (cancelled) return;
        setState({ creationId, preview: preview || null });
      } catch {
        if (cancelled) return;
        setState({ creationId, preview: null });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [creationId, loadPreview]);

  return creationId && state.creationId === creationId ? state.preview : null;
}

export function useStoryRoomDetailsRailViewModel({
  room = {},
  cast = [],
  messages = [],
  chatColorProps = null,
  deleteError = "",
  autoOpenViewer = false,
} = {}) {
  const catalogueCreationId = resolveStoryCatalogueCreationId({ room, cast });
  const cataloguePreview = useStoryCataloguePreview(catalogueCreationId);
  // The description under the title (brief 4 item 2, widened by review
  // round 5 item 2): the catalogue creation's description, the template
  // when the story launched from one, else the Character's own; hidden
  // only when the story resolves to no creation.
  const description = normalizeText(cataloguePreview?.creation?.description);
  const responderMediaItems = useMemo(
    () => buildLatestResponderMediaItems({ room, cast }),
    [room, cast]
  );

  // The existing gallery is the responder surface. When a Character or
  // Narrator has media, only that responder's collection is shown. If not,
  // fall back to story/template imagery rather than a duplicate responder
  // card above the carousel.
  const mediaItems = useMemo(() => {
    if (responderMediaItems.length) {
      return responderMediaItems;
    }

    const catalogueItems = projectPreviewFeaturedMedia(cataloguePreview, {
      altText: normalizeText(cataloguePreview?.creation?.title) || normalizeText(room?.title),
    });
    const storyItems = buildStoryMediaItems({ room, messages });
    const items = catalogueItems.length ? catalogueItems : storyItems;
    return items.slice(0, STORY_ROOM_GALLERY_MAX_IMAGES);
  }, [responderMediaItems, cataloguePreview, room, messages]);

  const gallerySourceKey = responderMediaItems.length
    ? `responder:${normalizeText(room?.featuredSpeakerParticipantId) || normalizeText(room?.featuredSpeakerName)}:${normalizeText(room?.featuredSpeakerImageUrl)}`
    : `story:${catalogueCreationId}:${mediaItems.map((item) => item.url).join("|")}`;

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(() =>
    autoOpenViewer && mediaItems.length ? 0 : null
  );
  const [activeDetail, setActiveDetail] = useState(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setViewerIndex(null);
  }, [gallerySourceKey]);

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

  // Paging never wraps (review round 5 item 1): the first slide has no
  // previous and the last stop (the end card, or the last image when no
  // end card exists) has no next; the View hides the missing arrow.
  const railStep = useCallback(
    (from, delta) =>
      railStopCount ? Math.max(0, Math.min(from + delta, railStopCount - 1)) : 0,
    [railStopCount]
  );
  const viewerItem =
    count && viewerIndex !== null ? mediaItems[Math.min(viewerIndex, count - 1)] || null : null;

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
      canGoPrevious: safeRailIndex > 0,
      canGoNext: railStopCount > 0 && safeRailIndex < railStopCount - 1,
      onSelect: (index) => setActiveIndex(Math.max(0, Math.min(index, count - 1))),
      onPrevious: () => setActiveIndex((current) => railStep(current, -1)),
      onNext: () => setActiveIndex((current) => railStep(current, 1)),
      // The viewer (review round 5 item 1) is the community image viewer
      // (KitImageViewer), mounted by the binding shell from `viewerItem`;
      // the gallery's own arrows are the way between images.
      viewerItem,
      onOpenViewer: (index) => setViewerIndex(Math.max(0, Math.min(index ?? safeActiveIndex, count - 1))),
      onCloseViewer: () => setViewerIndex(null),
    },
    // Delete authority stays in the chat shell; the binding rail receives
    // that handler separately and places the explicit danger action at
    // the bottom of the shared desktop/mobile rail content.
    deleteError: normalizeText(deleteError),
    rows: STORY_ROOM_DETAILS_ROWS,
    activeDetail,
    onOpenDetail: openDetail,
    onBack: () => setActiveDetail(null),
    chatColor: chatColorProps || null,
  };
}
