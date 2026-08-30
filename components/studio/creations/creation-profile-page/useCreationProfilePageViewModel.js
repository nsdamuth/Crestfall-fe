"use client";

import { useEffect, useMemo, useState } from "react";

import { getCreationCredits } from "@/lib/shared/creations/creationAttribution";
import {
  getCreationMediaCardUrl,
  getCreationMediaDisplayUrl,
  getCreationMediaLockedPreviewUrl,
  getCreationMediaThumbnailUrl,
  getFirstCreationMediaUrl,
} from "@/lib/shared/creations/creationMedia";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import {
  fetchMediaReactions,
  setMediaBookmark,
  setMediaLike,
} from "@/lib/client/studio/media/mediaReactionClient";
import {
  createLibraryPassPurchaseIdempotencyKey,
  purchaseCreationLibraryPass,
} from "@/lib/client/studio/creations/libraryPassClient";

export const CREATION_PROFILE_INITIAL_VISIBLE_MEDIA = 12;
export const CREATION_PROFILE_VISIBLE_MEDIA_INCREMENT = 12;
export const CREATION_PROFILE_EAGER_MEDIA_COUNT = 4;
export const CREATION_PROFILE_DESCRIPTION_PREVIEW_LIMIT = 420;


export const CREATION_PROFILE_MEDIA_TABS = [
  { id: "IMAGES", label: "Images", icon: "IMAGE" },
  { id: "VIDEOS", label: "Videos", icon: "VIDEO" },
  { id: "LIKED", label: "Liked", icon: "HEART" },
  { id: "BOOKMARKED", label: "Bookmarked", icon: "BOOKMARK" },
  { id: "ALL", label: "All", icon: "ALL" },
];

export const CREATION_PROFILE_CREDITS_TAB = {
  id: "CREDITS",
  label: "Credits",
  icon: "CREDITS",
};

export function buildCreationProfileTabs({
  credits = [],
  activeTab = "IMAGES",
} = {}) {
  const tabs = credits.length
    ? [...CREATION_PROFILE_MEDIA_TABS, CREATION_PROFILE_CREDITS_TAB]
    : CREATION_PROFILE_MEDIA_TABS;

  return tabs.map((tab) => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeTags(value) {
  return Array.isArray(value)
    ? value.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
}

function formatCoinAmount(value) {
  const amount = Number.parseInt(value, 10);
  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0
  );
}

export function projectCreationProfileLibraryPassPanel({
  state,
  purchaseStatus = "idle",
  purchaseMessage = "",
} = {}) {
  if (!state?.passRequired) return null;

  const eligibleImageCount =
    Number.parseInt(state.eligibleImageCount, 10) || 0;
  const publicPreviewCount =
    Number.parseInt(state.publicPreviewCount, 10) || 4;
  const currentPriceCoins =
    Number.parseInt(state.currentPriceCoins, 10) || 0;
  const protectedImageCount = Math.max(
    eligibleImageCount - publicPreviewCount,
    0
  );
  const isOwner = Boolean(state.isOwner);
  const hasActiveEntitlement = Boolean(
    state.hasActiveEntitlement
  );
  const hasFullAccess = Boolean(
    isOwner || hasActiveEntitlement || state.canViewFullLibrary
  );
  const salesEnabled = Boolean(state.salesEnabled);
  const canPurchase = Boolean(
    state.canPurchase &&
      salesEnabled &&
      !hasFullAccess
  );
  const purchaseBusy = purchaseStatus === "purchasing";

  return {
    isOwner,
    hasActiveEntitlement,
    hasFullAccess,
    salesEnabled,
    canPurchase,
    purchaseBusy,
    purchaseStatus,
    purchaseMessage: normalizeText(purchaseMessage),
    currentPriceCoins,
    currentPriceLabel: `${formatCoinAmount(currentPriceCoins)} coins`,
    eligibleImageCount,
    publicPreviewCount,
    protectedImageCount,
    includesFutureAdditions: state.includesFutureAdditions !== false,
    statusLabel: isOwner
      ? "Creator access"
      : hasActiveEntitlement
        ? "Library Pass active"
        : salesEnabled
          ? "Extended library locked"
          : "New pass sales paused",
    actionLabel: purchaseBusy
      ? "Unlocking..."
      : `Unlock full library — ${formatCoinAmount(currentPriceCoins)} coins`,
  };
}

export function getCreationProfileMediaImageUrl(item) {
  return getCreationMediaDisplayUrl(item, null);
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
  return (Array.isArray(media) ? media : []).map((item, index) => {
    const accessState = normalizeText(
      item?.accessState || item?.access_state
    ).toUpperCase();
    const isLocked = Boolean(
      item?.isLocked === true || accessState === "LOCKED"
    );
    const lockedPreviewUrl = getCreationMediaLockedPreviewUrl(item);
    const displayUrl = isLocked
      ? null
      : getCreationProfileMediaImageUrl(item);
    const cardUrl = isLocked
      ? null
      : getCreationMediaCardUrl(item, displayUrl);
    const thumbnailUrl = isLocked
      ? null
      : getCreationMediaThumbnailUrl(item, cardUrl || displayUrl);

    return {
      ...item,
      id: getMediaId(item, index),
      imageOutputId: getCreationProfileReactionImageOutputId(item),
      imageUrl: isLocked ? lockedPreviewUrl : displayUrl,
      displayUrl,
      cardUrl,
      thumbnailUrl,
      lockedPreviewUrl,
      accessState,
      isLocked,
      canViewOriginal: Boolean(item?.canViewOriginal),
      canUseInTools: Boolean(item?.canUseInTools),
      canUseInChat: Boolean(item?.canUseInChat),
      title: normalizeText(item?.title, item?.type || "Creation media"),
      type: normalizeText(item?.type, "IMAGE").toUpperCase(),
      contentRating: normalizeText(item?.contentRating, "SFW"),
      createdAt: item?.createdAt || item?.created_at || null,
      liked: isLocked ? false : Boolean(item?.liked),
      bookmarked: isLocked ? false : Boolean(item?.bookmarked),
    };
  });
}

export function filterCreationProfileMedia({
  media,
  activeTab,
  query,
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

  return filtered;
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
    imageUrl: normalizeText(
      getFirstCreationMediaUrl(
        creation.featuredMedia || creation.featured_media || [],
        {
          variant: "card",
          fallback:
            creation.cardUrl ||
            creation.card_url ||
            creation.imageUrl ||
            creation.image_url ||
            null,
        }
      )
    ),
    description: creation.description,
    tags: normalizeTags(creation.tags),
    creatorHandle: normalizeText(creation.creatorHandle),
    creatorProfileHref: normalizeText(creation.creatorProfileHref),
    stats: creation.stats,
    credits: Array.isArray(creation.credits)
      ? creation.credits
      : getCreationCredits(creation),
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
  libraryPass = null,
  loadError = null,
  navigate,
  refreshPage,
} = {}) {
  const normalizedCreation = useMemo(
    () => normalizeCreationProfileCreation(creation),
    [creation]
  );
  const normalizedMedia = useMemo(
    () => normalizeCreationProfileMedia(media),
    [media]
  );

  const [activeTab, setActiveTab] = useState("IMAGES");
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
  const [libraryPassPurchaseStatus, setLibraryPassPurchaseStatus] =
    useState("idle");
  const [libraryPassPurchaseMessage, setLibraryPassPurchaseMessage] =
    useState("");

  useEffect(() => {
    const imageOutputIds = [
      ...new Set(
        normalizedMedia
          .filter((item) => !item.isLocked)
          .map((item) => item.imageOutputId)
          .filter(Boolean)
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
      filterCreationProfileMedia({
        media: mediaWithLocalReactions,
        activeTab,
        query,
      }),
    [mediaWithLocalReactions, activeTab, query]
  );

  const visibleMedia = filteredMedia
    .slice(0, visibleCount)
    .map((item, index) => ({
      ...item,
      priority: index < CREATION_PROFILE_EAGER_MEDIA_COUNT,
    }));
  const activePreviewItem = activePreviewId
    ? filteredMedia.find((item) => item.id === activePreviewId) || null
    : null;

  function resetVisibleCount() {
    setVisibleCount(CREATION_PROFILE_INITIAL_VISIBLE_MEDIA);
  }

  function selectTab(nextTab) {
    setActiveTab(nextTab);
    resetVisibleCount();
  }

  function changeQuery(nextQuery) {
    setQuery(nextQuery);
    resetVisibleCount();
  }

  async function toggleLikedMedia(item) {
    if (item?.isLocked) {
      setReactionMessage(
        "Unlock this creation's Library Pass to react to protected media."
      );
      return;
    }

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
    if (item?.isLocked) {
      setReactionMessage(
        "Unlock this creation's Library Pass to react to protected media."
      );
      return;
    }

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

  async function purchaseLibraryPass() {
    if (
      !normalizedCreation?.id ||
      libraryPassPurchaseStatus === "purchasing"
    ) {
      return;
    }

    setLibraryPassPurchaseStatus("purchasing");
    setLibraryPassPurchaseMessage("");

    try {
      await purchaseCreationLibraryPass(
        normalizedCreation.id,
        createLibraryPassPurchaseIdempotencyKey()
      );
      setLibraryPassPurchaseStatus("success");
      setLibraryPassPurchaseMessage(
        "Library Pass purchased. Unlocking the full library..."
      );
      refreshPage?.();
    } catch (error) {
      setLibraryPassPurchaseStatus("error");
      setLibraryPassPurchaseMessage(
        error?.message || "Library Pass purchase could not be completed."
      );
    }
  }

  async function startChat() {
    if (!normalizedCreation?.supportsChat || startingChat) return;

    setChatError("");
    setStartingChat(true);
    try {
      const data = await startStoryFromCreation(normalizedCreation.raw);
      const roomId = data?.room?.id;
      if (!roomId) throw new Error("Story was created without a room id.");
      navigate?.(`/studio/story-rooms/${roomId}`);
    } catch (error) {
      setChatError(error?.message || "Story could not be started.");
      setStartingChat(false);
    }
  }

  function openMedia(itemId) {
    const item = filteredMedia.find(
      (candidate) => candidate.id === itemId
    );

    if (item?.isLocked) {
      setLibraryPassPurchaseMessage(
        "This image is part of the protected Library Pass collection."
      );
      return;
    }

    setActivePreviewId(itemId || null);
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
    activeTab,
    credits: normalizedCreation?.credits || [],
    mediaTabs: buildCreationProfileTabs({
      credits: normalizedCreation?.credits || [],
      activeTab,
    }),
    query,
    libraryPassPanel: projectCreationProfileLibraryPassPanel({
      state: libraryPass,
      purchaseStatus: libraryPassPurchaseStatus,
      purchaseMessage: libraryPassPurchaseMessage,
    }),
    visibleMedia,
    filteredMedia,
    activePreviewItem,
    activePreviewId,
    hasMoreMedia: visibleCount < filteredMedia.length,
    reactionMessage,
    startingChat,
    chatError,
    onSelectTab: selectTab,
    onQueryChange: changeQuery,
    onLoadMore: () =>
      setVisibleCount(
        (current) => current + CREATION_PROFILE_VISIBLE_MEDIA_INCREMENT
      ),
    onOpenMedia: openMedia,
    onPurchaseLibraryPass: purchaseLibraryPass,
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
    onStartChat: startChat,
  };
}
