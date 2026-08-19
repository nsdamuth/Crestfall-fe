"use client";

import { useEffect, useMemo, useState } from "react";

import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import {
  getStoryOpeningLocationStartConfig,
  startStoryFromCreation,
} from "@/lib/client/studio/story-rooms/storyRoomClient";

import {
  projectStoryStartOpeningLocationPresentation,
} from "@/components/studio/story-rooms/story-start-opening-location/StoryStartOpeningLocationPresentation.contract.js";
import {
  fetchMediaReactions,
  setMediaBookmark,
  setMediaLike,
} from "@/lib/client/studio/media/mediaReactionClient";
import {
  projectCreationProfileLibraryPassAccess,
  useCreationLibraryPassPublicViewModel,
} from "./useCreationLibraryPassPublicViewModel";

export const CREATION_PROFILE_INITIAL_VISIBLE_MEDIA = 12;
export const CREATION_PROFILE_VISIBLE_MEDIA_INCREMENT = 12;
export const CREATION_PROFILE_EAGER_MEDIA_COUNT = 4;
export const CREATION_PROFILE_DESCRIPTION_PREVIEW_LIMIT = 420;

export const CREATION_PROFILE_SORT_OPTIONS = [
  { value: "NEWEST", label: "Newest" },
  { value: "OLDEST", label: "Oldest" },
  { value: "TOP", label: "Top / All Time" },
  { value: "LIKED", label: "Liked First" },
];

export const CREATION_PROFILE_MEDIA_TABS = [
  { id: "IMAGES", label: "Images", icon: "IMAGE" },
  { id: "VIDEOS", label: "Videos", icon: "VIDEO" },
  { id: "LIKED", label: "Liked", icon: "HEART" },
  { id: "BOOKMARKED", label: "Bookmarked", icon: "BOOKMARK" },
  { id: "ALL", label: "All", icon: "ALL" },
];

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeTags(value) {
  return Array.isArray(value)
    ? value.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
}

export function getCreationProfileMediaImageUrl(item) {
  return (
    item?.imageUrl ||
    item?.displayUrl ||
    item?.displayImageUrl ||
    item?.thumbnailUrl ||
    item?.url ||
    null
  );
}

export function getCreationProfileReactionImageOutputId(item) {
  return normalizeText(
    item?.imageOutputId ||
      item?.image_output_id ||
      item?.outputId ||
      item?.output_id
  );
}

function getMediaId(item, index) {
  return normalizeText(
    item?.id ||
      item?.libraryEntryId ||
      item?.library_entry_id ||
      getCreationProfileReactionImageOutputId(item),
    `creation-media-${index + 1}`
  );
}

export function normalizeCreationProfileMedia(media) {
  return (Array.isArray(media) ? media : []).map((item, index) => ({
    ...item,
    id: getMediaId(item, index),
    imageOutputId: getCreationProfileReactionImageOutputId(item),
    imageUrl: getCreationProfileMediaImageUrl(item),
    title: normalizeText(item?.title, item?.type || "Creation media"),
    type: normalizeText(item?.type, "IMAGE").toUpperCase(),
    contentRating: normalizeText(item?.contentRating, "SFW"),
    createdAt: item?.createdAt || item?.created_at || null,
    liked: Boolean(item?.liked),
    bookmarked: Boolean(item?.bookmarked),
  }));
}

export function filterAndSortCreationProfileMedia({
  media,
  activeTab,
  query,
  sort,
}) {
  const normalizedQuery = normalizeText(query).toLowerCase();
  const filtered = (Array.isArray(media) ? media : []).filter((item) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "IMAGES" && item.type === "IMAGE") ||
      (activeTab === "VIDEOS" && item.type === "VIDEO") ||
      (activeTab === "LIKED" && item.liked) ||
      (activeTab === "BOOKMARKED" && item.bookmarked);

    const searchableText = [item.title, item.contentRating, item.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesTab && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return [...filtered].sort((a, b) => {
    if (sort === "OLDEST") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (sort === "LIKED") {
      return Number(b.liked) - Number(a.liked);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

export function getCreationProfileDescription(description, expanded = false) {
  const text = normalizeText(description, "No description has been added yet.");
  const hasLongDescription =
    text.length > CREATION_PROFILE_DESCRIPTION_PREVIEW_LIMIT;

  return {
    text,
    hasLongDescription,
    visibleText:
      hasLongDescription && !expanded
        ? `${text
            .slice(0, CREATION_PROFILE_DESCRIPTION_PREVIEW_LIMIT)
            .trimEnd()}…`
        : text,
    toggleLabel: expanded ? "Show less" : "Show more",
  };
}

export function normalizeCreationProfileCreation(creation) {
  if (!creation) return null;

  const title = normalizeText(creation.title, "Untitled Creation");
  const encodedId = creation.id ? encodeURIComponent(creation.id) : "";

  return {
    raw: creation,
    id: normalizeText(creation.id),
    title,
    titleInitial: title.slice(0, 1).toUpperCase() || "C",
    subtitle: normalizeText(creation.subtitle),
    imageUrl: normalizeText(creation.imageUrl || creation.image_url),
    description: creation.description,
    tags: normalizeTags(creation.tags),
    creatorHandle: normalizeText(creation.creatorHandle),
    creatorProfileHref: normalizeText(creation.creatorProfileHref),
    stats: creation.stats,
    supportsChat: isChatCapableCreationType(creation.type),
    catalogueHref: encodedId
      ? `/studio/creations/${encodedId}`
      : "/studio/community",
    imageStudioHref: encodedId
      ? `/studio/image-studio?creation=${encodedId}`
      : "/studio/image-studio",
  };
}

function toggleSetItem(setter, id) {
  if (!id) return;
  setter((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

export function useCreationProfilePageViewModel({
  creation,
  media = [],
  loadError = null,
  navigate,
} = {}) {
  const normalizedCreation = useMemo(
    () => normalizeCreationProfileCreation(creation),
    [creation]
  );
  const normalizedMedia = useMemo(
    () => normalizeCreationProfileMedia(media),
    [media]
  );
  const libraryPass = useCreationLibraryPassPublicViewModel({
    creationId: normalizedCreation?.id,
  });

  const [activeTab, setActiveTab] = useState("IMAGES");
  const [sort, setSort] = useState("NEWEST");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(
    CREATION_PROFILE_INITIAL_VISIBLE_MEDIA
  );
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [likedMediaIds, setLikedMediaIds] = useState(() => new Set());
  const [bookmarkedMediaIds, setBookmarkedMediaIds] = useState(() => new Set());
  const [reactionMessage, setReactionMessage] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const [openingLocationPickerOpen, setOpeningLocationPickerOpen] =
    useState(false);
  const [openingLocationId, setOpeningLocationId] = useState("");

  const openingLocationConfig =
    getStoryOpeningLocationStartConfig(
      normalizedCreation?.raw || {}
    );

  const effectiveOpeningLocationId =
    openingLocationConfig.allowedLocationIds.includes(
      openingLocationId
    )
      ? openingLocationId
      : "";

  useEffect(() => {
    const imageOutputIds = [
      ...new Set(
        normalizedMedia.map((item) => item.imageOutputId).filter(Boolean)
      ),
    ];

    if (!imageOutputIds.length) {
      setLikedMediaIds(new Set());
      setBookmarkedMediaIds(new Set());
      return undefined;
    }

    let cancelled = false;

    fetchMediaReactions(imageOutputIds)
      .then((reactions) => {
        if (cancelled) return;
        setLikedMediaIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "LIKE")
              .map((reaction) => reaction.imageOutputId)
          )
        );
        setBookmarkedMediaIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "BOOKMARK")
              .map((reaction) => reaction.imageOutputId)
          )
        );
      })
      .catch(() => {
        if (cancelled) return;
        setLikedMediaIds(new Set());
        setBookmarkedMediaIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedMedia]);

  const mediaWithLocalReactions = useMemo(
    () =>
      normalizedMedia.map((item) => ({
        ...item,
        liked:
          item.liked ||
          Boolean(item.imageOutputId && likedMediaIds.has(item.imageOutputId)),
        bookmarked:
          item.bookmarked ||
          Boolean(
            item.imageOutputId && bookmarkedMediaIds.has(item.imageOutputId)
          ),
      })),
    [normalizedMedia, likedMediaIds, bookmarkedMediaIds]
  );

  const filteredMedia = useMemo(
    () =>
      filterAndSortCreationProfileMedia({
        media: mediaWithLocalReactions,
        activeTab,
        query,
        sort,
      }),
    [mediaWithLocalReactions, activeTab, query, sort]
  );

  const accessControlledMedia = useMemo(
    () =>
      projectCreationProfileLibraryPassAccess({
        media: filteredMedia,
        libraryPassState: libraryPass.state,
        loadStatus: libraryPass.loadStatus,
      }),
    [
      filteredMedia,
      libraryPass.loadStatus,
      libraryPass.state,
    ]
  );

  const visibleMedia = accessControlledMedia
    .slice(0, visibleCount)
    .map((item, index) => ({
      ...item,
      priority:
        !item.locked &&
        index < CREATION_PROFILE_EAGER_MEDIA_COUNT,
    }));
  const lightboxMedia =
    accessControlledMedia.filter(
      (item) => !item.locked
    );
  const activePreviewItem = activePreviewId
    ? lightboxMedia.find(
        (item) => item.id === activePreviewId
      ) || null
    : null;
  const lockedMediaCount =
    accessControlledMedia.filter(
      (item) => item.locked
    ).length;

  function resetVisibleCount() {
    setVisibleCount(CREATION_PROFILE_INITIAL_VISIBLE_MEDIA);
  }

  function selectTab(nextTab) {
    setActiveTab(nextTab);
    resetVisibleCount();
  }

  function changeSort(nextSort) {
    setSort(nextSort);
    resetVisibleCount();
  }

  function changeQuery(nextQuery) {
    setQuery(nextQuery);
    resetVisibleCount();
  }

  async function toggleLikedMedia(item) {
    const imageOutputId = item?.imageOutputId;
    if (!imageOutputId) {
      setReactionMessage(
        "This image cannot be liked yet because it has no output id."
      );
      return;
    }

    const nextActive = !likedMediaIds.has(imageOutputId);
    setReactionMessage("");
    toggleSetItem(setLikedMediaIds, imageOutputId);

    try {
      await setMediaLike(imageOutputId, nextActive);
    } catch (error) {
      toggleSetItem(setLikedMediaIds, imageOutputId);
      setReactionMessage(error?.message || "Like could not be saved.");
    }
  }

  async function toggleBookmarkedMedia(item) {
    const imageOutputId = item?.imageOutputId;
    if (!imageOutputId) {
      setReactionMessage(
        "This image cannot be bookmarked yet because it has no output id."
      );
      return;
    }

    const nextActive = !bookmarkedMediaIds.has(imageOutputId);
    setReactionMessage("");
    toggleSetItem(setBookmarkedMediaIds, imageOutputId);

    try {
      await setMediaBookmark(imageOutputId, nextActive);
    } catch (error) {
      toggleSetItem(setBookmarkedMediaIds, imageOutputId);
      setReactionMessage(error?.message || "Bookmark could not be saved.");
    }
  }

  function openMedia(itemId) {
    const item =
      accessControlledMedia.find(
        (candidate) =>
          candidate.id === itemId
      );

    if (item?.locked) {
      libraryPass.onOpenPurchase();
      return;
    }

    setActivePreviewId(itemId || null);
  }

  async function startChat({ forceSelection = false } = {}) {
    if (!normalizedCreation?.supportsChat || startingChat) return;

    if (
      openingLocationConfig.selectionRequired &&
      !effectiveOpeningLocationId &&
      !forceSelection
    ) {
      setOpeningLocationPickerOpen(true);
      setChatError("");
      return;
    }

    if (
      openingLocationConfig.selectionRequired &&
      !effectiveOpeningLocationId
    ) {
      setChatError("Choose one of the allowed starting Locations.");
      return;
    }

    setChatError("");
    setStartingChat(true);
    try {
      const data = await startStoryFromCreation(normalizedCreation.raw, {
        openingLocationId: effectiveOpeningLocationId || null,
      });
      const roomId = data?.room?.id;
      if (!roomId) throw new Error("Story was created without a room id.");
      navigate?.(`/studio/story-rooms/${roomId}`);
    } catch (error) {
      setChatError(error?.message || "Story could not be started.");
      setStartingChat(false);
    }
  }

  return {
    shouldRender: Boolean(loadError || normalizedCreation),
    loadErrorMessage: loadError
      ? `Creation catalogue could not be loaded: ${loadError}`
      : "",
    creation: normalizedCreation,
    description: getCreationProfileDescription(
      normalizedCreation?.description,
      descriptionExpanded
    ),
    mediaTabs: CREATION_PROFILE_MEDIA_TABS.map((tab) => ({
      ...tab,
      active: tab.id === activeTab,
    })),
    sortOptions: CREATION_PROFILE_SORT_OPTIONS,
    sort,
    query,
    visibleMedia,
    filteredMedia: accessControlledMedia,
    lightboxMedia,
    activePreviewItem,
    activePreviewId,
    hasMoreMedia:
      visibleCount < accessControlledMedia.length,
    reactionMessage,
    startingChat,
    chatError,

    openingLocationPicker: openingLocationConfig.selectionRequired
      ? projectStoryStartOpeningLocationPresentation({
          selectionRequired: true,
          open: openingLocationPickerOpen,
          options: openingLocationConfig.options,
          selectedLocationId: effectiveOpeningLocationId,
          pending: startingChat,
          error: chatError,
          callbacks: {
            onSelect: setOpeningLocationId,
            onCancel: () => {
              setOpeningLocationPickerOpen(false);
              setChatError("");
            },
            onConfirm: () => startChat({ forceSelection: true }),
          },
        })
      : null,

    libraryPassPanel: {
      ...libraryPass.panel,
      shouldShow:
        libraryPass.panel.shouldShow ||
        (
          libraryPass.loadStatus !== "loaded" &&
          accessControlledMedia.length >
            libraryPass.previewCount
        ),
      lockedMediaCount,
    },
    libraryPassModal: libraryPass.modal,
    libraryPassMessage:
      libraryPass.message,
    libraryPassMessageTone:
      libraryPass.messageTone,

    onSelectTab: selectTab,
    onSortChange: changeSort,
    onQueryChange: changeQuery,
    onLoadMore: () =>
      setVisibleCount(
        (current) => current + CREATION_PROFILE_VISIBLE_MEDIA_INCREMENT
      ),
    onOpenMedia: openMedia,
    onCloseMedia: () => setActivePreviewId(null),
    onSelectPreviewItem: (item) => setActivePreviewId(item?.id || null),
    onToggleLike: toggleLikedMedia,
    onToggleBookmark: toggleBookmarkedMedia,
    isItemLiked: (item) =>
      Boolean(
        item?.imageOutputId && likedMediaIds.has(item.imageOutputId)
      ),
    isItemBookmarked: (item) =>
      Boolean(
        item?.imageOutputId && bookmarkedMediaIds.has(item.imageOutputId)
      ),
    onToggleDescription: () =>
      setDescriptionExpanded((current) => !current),
    onStartChat: () => startChat(),
    onOpenLibraryPassPurchase:
      libraryPass.onOpenPurchase,
    onCloseLibraryPassPurchase:
      libraryPass.onClosePurchase,
    onConfirmLibraryPassPurchase:
      libraryPass.onConfirmPurchase,
  };
}
