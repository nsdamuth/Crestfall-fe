"use client";

import { useState } from "react";

import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { setDefaultPlayerCharacter } from "@/lib/client/studio/profile/defaultPlayerCharacterClient";
import {
  getCreationCreator,
  getCreationCredits,
} from "@/lib/shared/creations/creationAttribution";
import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

export const CREATION_DESCRIPTION_PREVIEW_LIMIT = 520;

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeTags(value) {
  return Array.isArray(value)
    ? value.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
}

export function normalizeCreationPreviewMedia(creation = {}) {
  const possibleMediaArrays = [
    creation.featuredMedia,
    creation.featured_media,
    creation.featuredImages,
    creation.featured_images,
    creation.media,
    creation.images,
  ];

  const firstArray = possibleMediaArrays.find((item) => Array.isArray(item));
  const media = firstArray
    ? firstArray
    : [
        creation.image,
        creation.imageUrl,
        creation.image_url,
        creation.coverImage,
        creation.cover_image,
        creation.profileImage,
        creation.profile_image,
      ]
        .filter(Boolean)
        .map((url, index) => ({
          id: `fallback-media-${index + 1}`,
          url,
          title: creation.title || creation.name || "Creation preview",
        }));

  return media
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `media-${index + 1}`,
          url: item,
          title: `Preview ${index + 1}`,
        };
      }

      if (!item || typeof item !== "object") return null;

      return {
        id: item.id || `media-${index + 1}`,
        url:
          item.url ||
          item.imageUrl ||
          item.image_url ||
          item.assetUrl ||
          item.asset_url ||
          null,
        title: item.title || item.label || `Preview ${index + 1}`,
      };
    })
    .filter((item) => item?.url)
    .slice(0, 4);
}

export function resolveCreationPreviewCatalogueHref(
  creation = {},
  context = "owner"
) {
  const encodedCreationId = creation.id
    ? encodeURIComponent(creation.id)
    : "";

  if (context === "owner" && encodedCreationId) {
    return `/studio/my-creations/${encodedCreationId}/image-library`;
  }

  return (
    creation.catalogueHref ||
    creation.imageLibraryHref ||
    (encodedCreationId
      ? `/studio/creations/${encodedCreationId}`
      : "/studio/community")
  );
}

export function getCreationDescriptionPreview(
  description,
  expanded = false,
  limit = CREATION_DESCRIPTION_PREVIEW_LIMIT
) {
  const text = normalizeText(
    description,
    "No description has been added yet."
  );
  const hasLongDescription = text.length > limit;

  return {
    text,
    hasLongDescription,
    visibleText:
      hasLongDescription && !expanded
        ? `${text.slice(0, limit).trimEnd()}…`
        : text,
    toggleLabel: expanded ? "See less" : "See more",
  };
}

export function getCreationPreviewViewProps({
  creation,
  context = "owner",
  liked = false,
  bookmarked = false,
  activeMediaIndex = 0,
  descriptionExpanded = false,
  startingChat = false,
  chatError = "",
  settingDefaultPc = false,
  defaultPcStatus = "",
  defaultPcError = "",
  canLike = false,
  canBookmark = false,
} = {}) {
  if (!creation) return null;

  const title = normalizeText(creation.title, "Untitled Creation");
  const description = getCreationDescriptionPreview(
    creation.description,
    descriptionExpanded
  );
  const creator = getCreationCreator(creation);
  const credits = getCreationCredits(creation);
  const catalogueHref = resolveCreationPreviewCatalogueHref(creation, context);
  const featuredMedia = normalizeCreationPreviewMedia(creation);
  const hasFeaturedMedia = featuredMedia.length > 0;
  const moreSlideIndex = featuredMedia.length;
  const activeMedia = featuredMedia[activeMediaIndex] || null;
  const isMoreSlide =
    hasFeaturedMedia && activeMediaIndex === moreSlideIndex;
  const supportsChat = isChatCapableCreationType(creation.type);
  const isPlayerCharacter =
    normalizeText(creation.type).toUpperCase() === "PLAYER_CHARACTER";
  const canSetDefaultPc = Boolean(
    context === "owner" && isPlayerCharacter && creation.id
  );
  const isShareable = Boolean(
    creation.id &&
      normalizeText(creation.visibility).toUpperCase() !== "PRIVATE"
  );

  return {
    creation,
    context,
    title,
    subtitle: normalizeText(creation.subtitle),
    titleInitial: title.slice(0, 1).toUpperCase(),
    description,
    tags: normalizeTags(creation.tags),
    creator: {
      handle: normalizeText(creator?.handle),
      href: normalizeText(creator?.href),
    },
    credits: Array.isArray(credits) ? credits : [],
    catalogueHref,
    editHref: normalizeText(creation.editHref),
    statusBadgesProps: { creation },
    statsRowProps: { stats: creation.stats },
    moreSlideBackgroundImage: getDefaultCreationImageForType(creation.type),
    featuredMedia,
    hasFeaturedMedia,
    activeMediaIndex,
    activeMedia,
    isMoreSlide,
    moreSlideIndex,
    mediaIndicators: Array.from(
      { length: featuredMedia.length + 1 },
      (_, index) => ({
        id: `preview-indicator-${index}`,
        index,
        label:
          index === moreSlideIndex
            ? "View more prompt"
            : `Preview image ${index + 1}`,
      })
    ),
    liked: Boolean(liked),
    bookmarked: Boolean(bookmarked),
    canLike: Boolean(canLike),
    canBookmark: Boolean(canBookmark),
    supportsChat,
    canSetDefaultPc,
    isShareable,
    startingChat: Boolean(startingChat),
    settingDefaultPc: Boolean(settingDefaultPc),
    chatError: normalizeText(chatError),
    defaultPcStatus: normalizeText(defaultPcStatus),
    defaultPcError: normalizeText(defaultPcError),
  };
}

export function useCreationPreviewModalViewModel({
  creation,
  context = "owner",
  liked = false,
  bookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onClose,
  navigate,
} = {}) {
  const [mediaIndexByCreationId, setMediaIndexByCreationId] = useState({});
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState("DETAILS");
  const [startingChat, setStartingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);
  const [defaultPcStatus, setDefaultPcStatus] = useState("");
  const [defaultPcError, setDefaultPcError] = useState("");

  const creationId = creation?.id;
  const activeMediaIndex = mediaIndexByCreationId[creationId] ?? 0;
  const viewProps = getCreationPreviewViewProps({
    creation,
    context,
    liked,
    bookmarked,
    activeMediaIndex,
    descriptionExpanded,
    startingChat,
    chatError,
    settingDefaultPc,
    defaultPcStatus,
    defaultPcError,
    canLike: typeof onToggleLike === "function",
    canBookmark: typeof onToggleBookmark === "function",
  });

  if (!viewProps) return null;

  function setActiveMediaIndex(nextValue) {
    if (!creationId) return;

    setMediaIndexByCreationId((currentByCreationId) => {
      const currentValue = currentByCreationId[creationId] ?? 0;
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

      return {
        ...currentByCreationId,
        [creationId]: resolvedValue,
      };
    });
  }

  function showPreviousMedia() {
    if (!viewProps.hasFeaturedMedia) return;

    setActiveMediaIndex((current) =>
      current <= 0 ? viewProps.moreSlideIndex : current - 1
    );
  }

  function showNextMedia() {
    if (!viewProps.hasFeaturedMedia) return;

    setActiveMediaIndex((current) =>
      current >= viewProps.moreSlideIndex ? 0 : current + 1
    );
  }

  async function startStory() {
    if (!viewProps.supportsChat || startingChat) return;

    setChatError("");
    setStartingChat(true);

    try {
      const data = await startStoryFromCreation(creation);
      const roomId = data?.room?.id;

      if (!roomId) {
        throw new Error("Story was created without a room id.");
      }

      navigate?.(buildStoryChatHref(roomId));
    } catch (error) {
      setChatError(error?.message || "Story could not be started.");
      setStartingChat(false);
    }
  }

  async function setAsDefaultPlayerCharacter() {
    if (!viewProps.canSetDefaultPc || settingDefaultPc) return;

    setDefaultPcStatus("");
    setDefaultPcError("");
    setSettingDefaultPc(true);

    try {
      await setDefaultPlayerCharacter(creation.id);
      setDefaultPcStatus("Default Player Character set.");
    } catch (error) {
      setDefaultPcError(
        error?.message || "Default Player Character could not be saved."
      );
    } finally {
      setSettingDefaultPc(false);
    }
  }

  return {
    ...viewProps,
    activeInfoTab:
      activeInfoTab === "CREDITS" && !viewProps.credits.length
        ? "DETAILS"
        : activeInfoTab,
    onSelectInfoTab: (tabId) =>
      setActiveInfoTab(
        tabId === "CREDITS" && !viewProps.credits.length ? "DETAILS" : tabId
      ),
    onClose,
    onToggleDescription: () =>
      setDescriptionExpanded((current) => !current),
    onSelectMedia: setActiveMediaIndex,
    onPreviousMedia: showPreviousMedia,
    onNextMedia: showNextMedia,
    onToggleLike:
      typeof onToggleLike === "function"
        ? () => onToggleLike(creation)
        : undefined,
    onToggleBookmark:
      typeof onToggleBookmark === "function"
        ? () => onToggleBookmark(creation)
        : undefined,
    onStartStory: startStory,
    onSetDefaultPc: setAsDefaultPlayerCharacter,
  };
}
