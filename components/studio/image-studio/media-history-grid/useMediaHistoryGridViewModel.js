"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchMediaReactions,
  setMediaBookmark,
  setMediaLike,
} from "@/lib/client/studio/media/mediaReactionClient";
import { deleteImageOutput } from "@/lib/client/studio/media/imageOutputClient";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

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

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getMediaHistorySourceCreationIds(item) {
  const job = item?.job || {};
  const sourceAssets =
    job?.sourceAssetsSnapshot || job?.source_assets_snapshot || {};

  return [
    item?.primarySubjectCreationId,
    item?.primary_subject_creation_id,
    job?.primarySubjectCreationId,
    job?.primary_subject_creation_id,
    sourceAssets?.characterId,
    sourceAssets?.character_id,
    sourceAssets?.playerCharacterId,
    sourceAssets?.player_character_id,
    sourceAssets?.poseId,
    sourceAssets?.pose_id,
    sourceAssets?.outfitId,
    sourceAssets?.outfit_id,
    sourceAssets?.locationId,
    sourceAssets?.location_id,
    sourceAssets?.renderingPresetId,
    sourceAssets?.rendering_preset_id,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function getMediaHistorySearchText(item, creationSearchLabelsById = {}) {
  const job = item?.job || {};
  const promptSnapshot = job?.promptSnapshot || job?.prompt_snapshot || {};
  const sourceLabels = getMediaHistorySourceCreationIds(item).map(
    (creationId) => creationSearchLabelsById[creationId] || ""
  );

  return [
    item?.title,
    promptSnapshot?.userPrompt,
    promptSnapshot?.user_prompt,
    promptSnapshot?.compiledPrompt,
    promptSnapshot?.compiled_prompt,
    ...sourceLabels,
  ]
    .map(normalizeSearchValue)
    .filter(Boolean)
    .join(" ");
}

export function filterMediaHistoryItems(
  items,
  activeFilter,
  searchQuery = "",
  creationSearchLabelsById = {}
) {
  let filtered = items;

  if (activeFilter === "IMAGES") {
    filtered = filtered.filter((item) => item.type !== "VIDEO");
  } else if (activeFilter === "VIDEOS") {
    filtered = filtered.filter((item) => item.type === "VIDEO");
  } else if (activeFilter === "LIKED") {
    filtered = filtered.filter((item) => item.liked);
  } else if (activeFilter === "BOOKMARKED") {
    filtered = filtered.filter((item) => item.bookmarked);
  }

  const normalizedQuery = normalizeSearchValue(searchQuery);
  if (!normalizedQuery) return filtered;

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  return filtered.filter((item) => {
    const haystack = getMediaHistorySearchText(item, creationSearchLabelsById);
    return queryTerms.every((term) => haystack.includes(term));
  });
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
  imageStudioHref = "/studio/image-studio",
  onCoinBalanceChange,
  onImageReassigned,
  onImageRenamed,
} = {}) {
  const safeGeneratedMedia = Array.isArray(generatedMedia)
    ? generatedMedia
    : EMPTY_MEDIA;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compactMobileGrid, setCompactMobileGrid] = useState(true);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [creationSearchLabelsById, setCreationSearchLabelsById] = useState({});
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
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchOwnedCreations({ view: "summary" })
      .then((creations) => {
        if (cancelled) return;

        const nextLabels = Object.fromEntries(
          (Array.isArray(creations) ? creations : [])
            .map((creation) => {
              const id = String(creation?.id || creation?.rowId || "").trim();
              if (!id) return null;

              const label = [
                creation?.title,
                creation?.name,
                creation?.data?.name,
                creation?.data?.title,
                ...(Array.isArray(creation?.data?.tags)
                  ? creation.data.tags
                  : []),
              ]
                .filter(Boolean)
                .join(" ");

              return [id, label];
            })
            .filter(Boolean)
        );

        setCreationSearchLabelsById(nextLabels);
      })
      .catch(() => {
        if (!cancelled) setCreationSearchLabelsById({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
    () =>
      filterMediaHistoryItems(
        mediaItems,
        activeFilter,
        searchQuery,
        creationSearchLabelsById
      ),
    [mediaItems, activeFilter, searchQuery, creationSearchLabelsById]
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
      setDeleteMessage("This image cannot be deleted because it has no output id.");
      return;
    }

    // Single-image deletion is confirmed by MediaLightbox's portable danger
    // surface. Do not fall back to browser-native confirm dialogs from the
    // application ViewModel.
    if (options.confirmed !== true) {
      setDeleteMessage("Open the image and confirm deletion from the media viewer.");
      return;
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
      setDeleteMessage(error?.message || "Image could not be deleted.");
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

  function handleBulkDeleteSelected() {
    if (isBulkDeleting || !selectedCount) return;
    setDeleteMessage("");
    setBulkDeleteConfirmOpen(true);
  }

  function handleCancelBulkDelete() {
    if (isBulkDeleting) return;
    setBulkDeleteConfirmOpen(false);
  }

  async function handleConfirmBulkDelete() {
    if (isBulkDeleting || !selectedCount) return;

    const imageOutputIds = [...selectedImageOutputIds].filter(
      isMediaHistoryUuid
    );
    if (!imageOutputIds.length) {
      setBulkDeleteConfirmOpen(false);
      setDeleteMessage("No deletable images remain selected.");
      return;
    }

    setBulkDeleteConfirmOpen(false);
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
        imageStudioHref,
        allowDownload: true,
        showStudioActions: true,
        isItemLiked: (item) =>
          likedMediaIds.has(getMediaHistoryImageOutputId(item)),
        isItemBookmarked: (item) =>
          bookmarkedMediaIds.has(getMediaHistoryImageOutputId(item)),
        onToggleLike: toggleLikedMedia,
        onToggleBookmark: toggleBookmarkedMedia,
        onDeleteItem: handleDeleteMedia,
        allowRename: true,
        onRenameItem: async (item, result) => {
          onImageRenamed?.({
            imageOutputId:
              result?.imageOutputId || getMediaHistoryImageOutputId(item),
            result,
          });
        },
        onReassignItem: async (item, result) => {
          if (result?.coinBalance !== undefined) {
            onCoinBalanceChange?.(result.coinBalance);
          }

          onImageReassigned?.({
            imageOutputId:
              result?.imageOutputId || getMediaHistoryImageOutputId(item),
            destinationCreationId: result?.destinationCreationId || null,
          });
        },
      }
    : null;

  return {
    filterOptions: MEDIA_HISTORY_FILTER_OPTIONS,
    activeFilter,
    searchQuery,
    filtersOpen,
    compactMobileGrid,
    mobileGridClass: compactMobileGrid
      ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3",
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
    bulkDeleteConfirmOpen,
    hasSelectableMedia: mediaItems.some((item) => item.selectable),
    hasVisibleSelectableMedia: visibleSelectableImageOutputIds.length > 0,
    allVisibleSelectableItemsSelected,
    summaryText,
    lightboxProps,
    eagerImageCount: EAGER_IMAGE_COUNT,
    masonryRowHeight: MASONRY_ROW_HEIGHT,
    masonryGap: MASONRY_GAP,
    onSetFilter: setActiveFilter,
    onChangeSearchQuery: setSearchQuery,
    onClearFilters: () => {
      setActiveFilter("ALL");
      setSearchQuery("");
    },
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
    onCancelBulkDelete: handleCancelBulkDelete,
    onConfirmBulkDelete: handleConfirmBulkDelete,
    onLoadMoreHistory,
  };
}
