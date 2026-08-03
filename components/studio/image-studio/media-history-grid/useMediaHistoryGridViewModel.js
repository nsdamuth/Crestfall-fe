"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchMediaReactions,
  setMediaBookmark,
  setMediaLike,
} from "@/lib/client/studio/media/mediaReactionClient";
import { deleteImageOutput } from "@/lib/client/studio/media/imageOutputClient";

export const EAGER_IMAGE_COUNT = 4;
export const MASONRY_ROW_HEIGHT = 8;
export const MASONRY_GAP = 12;
export const BULK_DELETE_CONCURRENCY = 3;

const EMPTY_MEDIA = Object.freeze([]);

export const MEDIA_HISTORY_FILTER_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "IMAGES", label: "Images" },
  { value: "VIDEOS", label: "Videos" },
  { value: "LIKED", label: "Liked" },
  { value: "BOOKMARKED", label: "Bookmarked" },
];

function toggleSetItem(setter, id) {
  if (!id) return;

  setter((current) => {
    const next = new Set(current);

    if (next.has(id)) next.delete(id);
    else next.add(id);

    return next;
  });
}

export function isMediaHistoryUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(value || "").trim()
  );
}

export function getMediaHistoryImageOutputId(item) {
  const candidate =
    item?.imageOutputId ||
    item?.image_output_id ||
    item?.outputId ||
    item?.output_id ||
    item?.imageGenerationOutputId ||
    item?.image_generation_output_id ||
    item?.output?.id ||
    item?.output?.rowId ||
    item?.output?.imageOutputId ||
    item?.output?.image_output_id ||
    item?.output?.outputId ||
    item?.output?.output_id ||
    item?.rawOutput?.id ||
    item?.rawOutput?.rowId ||
    item?.id ||
    "";

  return String(candidate || "").trim();
}

export function canSelectMediaHistoryItem(item) {
  if (!item || item.type === "VIDEO") return false;
  if (item.status === "pending" || item.status === "error") return false;

  return isMediaHistoryUuid(getMediaHistoryImageOutputId(item));
}

function getNumericDimension(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getNestedValue(source, path = []) {
  return path.reduce((current, key) => {
    if (!current || typeof current !== "object") return null;
    return current[key];
  }, source);
}

export function getMediaHistoryStoredDimensions(item) {
  const width =
    getNumericDimension(item?.width) ||
    getNumericDimension(item?.metadata?.width) ||
    getNumericDimension(item?.providerMetadata?.width) ||
    getNumericDimension(item?.provider_metadata?.width) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settingsSnapshot",
        "resolvedDimensions",
        "width",
      ])
    ) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settings_snapshot",
        "resolvedDimensions",
        "width",
      ])
    ) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settingsSnapshot",
        "resolved_dimensions",
        "width",
      ])
    );

  const height =
    getNumericDimension(item?.height) ||
    getNumericDimension(item?.metadata?.height) ||
    getNumericDimension(item?.providerMetadata?.height) ||
    getNumericDimension(item?.provider_metadata?.height) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settingsSnapshot",
        "resolvedDimensions",
        "height",
      ])
    ) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settings_snapshot",
        "resolvedDimensions",
        "height",
      ])
    ) ||
    getNumericDimension(
      getNestedValue(item, [
        "job",
        "settingsSnapshot",
        "resolved_dimensions",
        "height",
      ])
    );

  return { width, height };
}

export function normalizeMediaHistoryItem(item, index = 0) {
  const imageOutputId = getMediaHistoryImageOutputId(item);
  const storedDimensions = getMediaHistoryStoredDimensions(item);
  const title = item?.title || "Generated media";
  const type = item?.type || "IMAGE";
  const imageUrl = item?.imageUrl || null;
  const thumbnailUrl =
    item?.thumbnailUrl ||
    item?.thumbnail_url ||
    item?.thumbnailImageUrl ||
    item?.previewUrl ||
    imageUrl;

  return {
    ...item,
    id: item?.id || imageOutputId || `media-history-${index}`,
    title,
    type,
    imageUrl,
    thumbnailUrl,
    imageOutputId,
    storedWidth: storedDimensions.width,
    storedHeight: storedDimensions.height,
    errorMessage:
      item?.errorMessage || "Image generation could not be completed.",
  };
}

export function filterMediaHistoryItems(items, activeFilter) {
  if (activeFilter === "IMAGES") {
    return items.filter((item) => item.type !== "VIDEO");
  }

  if (activeFilter === "VIDEOS") {
    return items.filter((item) => item.type === "VIDEO");
  }

  if (activeFilter === "LIKED") {
    return items.filter((item) => item.liked);
  }

  if (activeFilter === "BOOKMARKED") {
    return items.filter((item) => item.bookmarked);
  }

  return items;
}

export async function deleteMediaHistoryOutputsWithConcurrency(
  imageOutputIds,
  concurrency = BULK_DELETE_CONCURRENCY
) {
  const ids = [...new Set(imageOutputIds.filter(isMediaHistoryUuid))];
  const results = new Array(ids.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < ids.length) {
      const index = nextIndex;
      nextIndex += 1;
      const imageOutputId = ids[index];

      try {
        await deleteImageOutput(imageOutputId, {
          deleteReason: "owner_bulk_deleted_from_image_studio",
        });

        results[index] = { imageOutputId, ok: true, error: null };
      } catch (error) {
        results[index] = {
          imageOutputId,
          ok: false,
          error: error?.message || "Image could not be deleted.",
        };
      }
    }
  }

  const workerCount = Math.min(
    Math.max(Number.parseInt(concurrency, 10) || 1, 1),
    ids.length
  );

  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

export function useMediaHistoryGridViewModel({
  generatedMedia = EMPTY_MEDIA,
  historyStatus = "idle",
  historyError = "",
  hasMoreHistory = false,
  isLoadingMoreHistory = false,
  onLoadMoreHistory,
} = {}) {
  const safeGeneratedMedia = Array.isArray(generatedMedia)
    ? generatedMedia
    : EMPTY_MEDIA;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compactMobileGrid, setCompactMobileGrid] = useState(true);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [likedMediaIds, setLikedMediaIds] = useState(() => new Set());
  const [bookmarkedMediaIds, setBookmarkedMediaIds] = useState(() => new Set());
  const [reactionMessage, setReactionMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletedImageOutputIds, setDeletedImageOutputIds] = useState(
    () => new Set()
  );
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImageOutputIds, setSelectedImageOutputIds] = useState(
    () => new Set()
  );
  const [bulkDeleteStatus, setBulkDeleteStatus] = useState("idle");

  useEffect(() => {
    const imageOutputIds = [
      ...new Set(
        safeGeneratedMedia
          .map(getMediaHistoryImageOutputId)
          .filter(isMediaHistoryUuid)
      ),
    ];

    if (!imageOutputIds.length) return undefined;

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
      .catch((error) => {
        if (cancelled) return;
        setReactionMessage(
          error?.message || "Saved media reactions could not be loaded."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [safeGeneratedMedia]);

  const mediaItems = useMemo(
    () =>
      safeGeneratedMedia
        .map(normalizeMediaHistoryItem)
        .filter(
          (item) => !deletedImageOutputIds.has(item.imageOutputId)
        )
        .map((item) => ({
          ...item,
          liked: Boolean(item?.liked) || likedMediaIds.has(item.imageOutputId),
          bookmarked:
            Boolean(item?.bookmarked) ||
            bookmarkedMediaIds.has(item.imageOutputId),
          selectable: canSelectMediaHistoryItem(item),
          selected: selectedImageOutputIds.has(item.imageOutputId),
        })),
    [
      safeGeneratedMedia,
      deletedImageOutputIds,
      likedMediaIds,
      bookmarkedMediaIds,
      selectedImageOutputIds,
    ]
  );

  const visibleMediaItems = useMemo(
    () => filterMediaHistoryItems(mediaItems, activeFilter),
    [mediaItems, activeFilter]
  );

  const visibleSelectableImageOutputIds = visibleMediaItems
    .filter((item) => item.selectable)
    .map((item) => item.imageOutputId);
  const selectedCount = selectedImageOutputIds.size;
  const allVisibleSelectableItemsSelected =
    visibleSelectableImageOutputIds.length > 0 &&
    visibleSelectableImageOutputIds.every((imageOutputId) =>
      selectedImageOutputIds.has(imageOutputId)
    );
  const isBulkDeleting = bulkDeleteStatus === "deleting";
  const activePreviewItem = activePreviewId
    ? mediaItems.find((item) => item.id === activePreviewId) || null
    : null;

  async function toggleLikedMedia(item) {
    const imageOutputId = getMediaHistoryImageOutputId(item);

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
    const imageOutputId = getMediaHistoryImageOutputId(item);

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

  async function handleDeleteMedia(item, options = {}) {
    const imageOutputId = getMediaHistoryImageOutputId(item);

    if (!isMediaHistoryUuid(imageOutputId)) {
      const message = "This image cannot be deleted because it has no output id.";
      setDeleteMessage(message);
      window.alert(message);
      return;
    }

    if (options.confirmed !== true) {
      const confirmed = window.confirm(
        "Delete this image from your Image Studio? This will also remove it from any character libraries and featured slots."
      );
      if (!confirmed) return;
    }

    setDeleteMessage("");

    try {
      await deleteImageOutput(imageOutputId, {
        deleteReason: "owner_deleted_from_image_studio",
      });

      setDeletedImageOutputIds((current) => {
        const next = new Set(current);
        next.add(imageOutputId);
        return next;
      });
      setSelectedImageOutputIds((current) => {
        const next = new Set(current);
        next.delete(imageOutputId);
        return next;
      });
      setActivePreviewId(null);
      setDeleteMessage("Image deleted.");
    } catch (error) {
      const message = error?.message || "Image could not be deleted.";
      setDeleteMessage(message);
      window.alert(message);
    }
  }

  function beginSelectionMode() {
    setActivePreviewId(null);
    setDeleteMessage("");
    setSelectionMode(true);
  }

  function endSelectionMode() {
    if (isBulkDeleting) return;
    setSelectionMode(false);
    setSelectedImageOutputIds(new Set());
  }

  function toggleMediaSelection(item) {
    if (isBulkDeleting || !canSelectMediaHistoryItem(item)) return;
    toggleSetItem(setSelectedImageOutputIds, item.imageOutputId);
  }

  function toggleSelectAllVisible() {
    if (isBulkDeleting || !visibleSelectableImageOutputIds.length) return;

    setSelectedImageOutputIds((current) => {
      const next = new Set(current);

      if (allVisibleSelectableItemsSelected) {
        visibleSelectableImageOutputIds.forEach((imageOutputId) => {
          next.delete(imageOutputId);
        });
      } else {
        visibleSelectableImageOutputIds.forEach((imageOutputId) => {
          next.add(imageOutputId);
        });
      }

      return next;
    });
  }

  async function handleBulkDeleteSelected() {
    if (isBulkDeleting || !selectedCount) return;

    const imageOutputIds = [...selectedImageOutputIds].filter(
      isMediaHistoryUuid
    );
    const confirmed = window.confirm(
      `Permanently delete ${imageOutputIds.length} selected ${
        imageOutputIds.length === 1 ? "image" : "images"
      }? This will remove them from Image Studio, connected character libraries, and featured image slots. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteMessage("");
    setBulkDeleteStatus("deleting");

    const results = await deleteMediaHistoryOutputsWithConcurrency(
      imageOutputIds
    );
    const successfulIds = results
      .filter((result) => result?.ok)
      .map((result) => result.imageOutputId);
    const failedIds = results
      .filter((result) => !result?.ok)
      .map((result) => result.imageOutputId);

    if (successfulIds.length) {
      setDeletedImageOutputIds((current) => {
        const next = new Set(current);
        successfulIds.forEach((imageOutputId) => next.add(imageOutputId));
        return next;
      });
    }

    setSelectedImageOutputIds(new Set(failedIds));
    setBulkDeleteStatus("idle");

    if (!failedIds.length) {
      setSelectionMode(false);
      setDeleteMessage(
        `Deleted ${successfulIds.length} ${
          successfulIds.length === 1 ? "image" : "images"
        }.`
      );
      return;
    }

    setDeleteMessage(
      `Deleted ${successfulIds.length} ${
        successfulIds.length === 1 ? "image" : "images"
      }. ${failedIds.length} ${
        failedIds.length === 1 ? "image could" : "images could"
      } not be deleted and remain selected.`
    );
  }

  const summaryText = mediaItems.length
    ? `Showing ${visibleMediaItems.length} of ${mediaItems.length} library items`
    : historyStatus === "loading"
      ? "Loading image library..."
      : "No library items yet";

  const lightboxProps = activePreviewItem
    ? {
        items: visibleMediaItems,
        activeItemId: activePreviewItem.id,
        onSelectItem: (item) => setActivePreviewId(item?.id || null),
        onClose: () => setActivePreviewId(null),
        modeLabel: "Image Studio",
        imageStudioHref: "/studio/image-studio",
        allowDownload: true,
        showStudioActions: true,
        isItemLiked: (item) =>
          likedMediaIds.has(getMediaHistoryImageOutputId(item)),
        isItemBookmarked: (item) =>
          bookmarkedMediaIds.has(getMediaHistoryImageOutputId(item)),
        onToggleLike: toggleLikedMedia,
        onToggleBookmark: toggleBookmarkedMedia,
        onDeleteItem: handleDeleteMedia,
      }
    : null;

  return {
    filterOptions: MEDIA_HISTORY_FILTER_OPTIONS,
    activeFilter,
    filtersOpen,
    compactMobileGrid,
    mobileGridClass: compactMobileGrid ? "grid-cols-2" : "grid-cols-1",
    mediaItems,
    visibleMediaItems,
    historyStatus,
    historyError,
    hasMoreHistory: Boolean(hasMoreHistory),
    isLoadingMoreHistory: Boolean(isLoadingMoreHistory),
    reactionMessage,
    deleteMessage,
    selectionMode,
    selectedCount,
    isBulkDeleting,
    hasSelectableMedia: mediaItems.some((item) => item.selectable),
    hasVisibleSelectableMedia: visibleSelectableImageOutputIds.length > 0,
    allVisibleSelectableItemsSelected,
    summaryText,
    lightboxProps,
    eagerImageCount: EAGER_IMAGE_COUNT,
    masonryRowHeight: MASONRY_ROW_HEIGHT,
    masonryGap: MASONRY_GAP,
    onSetFilter: setActiveFilter,
    onToggleFilters: () => setFiltersOpen((current) => !current),
    onToggleMobileGrid: () =>
      setCompactMobileGrid((current) => !current),
    onToggleSelectionMode: selectionMode
      ? endSelectionMode
      : beginSelectionMode,
    onToggleMediaSelection: toggleMediaSelection,
    onToggleLike: toggleLikedMedia,
    onToggleBookmark: toggleBookmarkedMedia,
    onOpenMedia: (item) => setActivePreviewId(item?.id || null),
    onToggleSelectAllVisible: toggleSelectAllVisible,
    onClearSelection: () => setSelectedImageOutputIds(new Set()),
    onBulkDeleteSelected: handleBulkDeleteSelected,
    onLoadMoreHistory,
  };
}
