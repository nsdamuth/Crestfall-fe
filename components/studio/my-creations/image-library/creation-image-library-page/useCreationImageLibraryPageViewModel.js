"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { useCreationImageLibraryViewModel } from "@/components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel";
import {
  fetchMediaReactions,
  setMediaBookmark,
  setMediaLike,
} from "@/lib/client/studio/media/mediaReactionClient";
import { deleteImageOutput } from "@/lib/client/studio/media/imageOutputClient";
import { useCreationLibraryPassOwnerViewModel } from "./useCreationLibraryPassOwnerViewModel";

export const FEATURED_SLOT_ORDER = ["primary", "alt1", "alt2", "alt3"];
export const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};
export const EAGER_IMAGE_COUNT = 4;

function toggleSetItem(setter, id) {
  if (!id) return;

  setter((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

export function getCreationLibraryImageOutputId(image) {
  return String(
    image?.imageOutputId ||
      image?.image_output_id ||
      image?.outputId ||
      image?.output_id ||
      image?.imageOutput?.id ||
      image?.output?.id ||
      ""
  ).trim();
}

function getProxiedOutputFileUrl(image, variant = "") {
  const imageOutputId = getCreationLibraryImageOutputId(image);
  if (!imageOutputId) return null;

  const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
  return `/api/studio/image-generation/outputs/${encodeURIComponent(
    imageOutputId
  )}/file${query}`;
}

export function getCreationLibraryFullImageUrl(image) {
  return (
    image?.displayImageUrl ||
    image?.displayUrl ||
    getProxiedOutputFileUrl(image) ||
    image?.thumbnailImageUrl ||
    image?.thumbnailUrl ||
    null
  );
}

export function getCreationLibraryThumbnailUrl(image) {
  return (
    image?.thumbnailImageUrl ||
    image?.thumbnailUrl ||
    getProxiedOutputFileUrl(image, "thumbnail") ||
    getCreationLibraryFullImageUrl(image)
  );
}

function getImageLabel(image) {
  if (!image) return "No image selected";

  return (
    image.displayImageUrl ||
    image.displayUrl ||
    image.thumbnailUrl ||
    image.storagePath ||
    getCreationLibraryImageOutputId(image) ||
    image.id ||
    "Image"
  );
}

function getNumericDimension(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getCreationLibraryDimensions(image) {
  const width =
    getNumericDimension(image?.width) ||
    getNumericDimension(image?.imageWidth) ||
    getNumericDimension(image?.image_width) ||
    getNumericDimension(image?.output?.width) ||
    getNumericDimension(image?.imageOutput?.width) ||
    getNumericDimension(image?.metadata?.width) ||
    getNumericDimension(image?.providerMetadata?.width);

  const height =
    getNumericDimension(image?.height) ||
    getNumericDimension(image?.imageHeight) ||
    getNumericDimension(image?.image_height) ||
    getNumericDimension(image?.output?.height) ||
    getNumericDimension(image?.imageOutput?.height) ||
    getNumericDimension(image?.metadata?.height) ||
    getNumericDimension(image?.providerMetadata?.height);

  return { width, height };
}

export function normalizeCreationLibraryImage(image, index = 0) {
  const { width, height } = getCreationLibraryDimensions(image);
  const imageOutputId = getCreationLibraryImageOutputId(image);
  const id = String(image?.id || imageOutputId || `library-image-${index}`);

  return {
    id,
    imageOutputId,
    thumbnailUrl: getCreationLibraryThumbnailUrl(image),
    displayUrl: getCreationLibraryFullImageUrl(image),
    label: getImageLabel(image),
    aspectRatio: width && height ? `${width} / ${height}` : "3 / 4",
    moderationStatus: image?.moderationStatus || "CLEAR",
    contentRating: image?.contentRating || "SFW",
    canUseAsFeatured: Boolean(image?.canUseAsFeatured),
    rawImage: image,
  };
}

export function useCreationImageLibraryPageViewModel({ creationId, showBackLink = true }) {
  const { setCoinBalanceFromServer } = useStudioAccount();
  const libraryState = useCreationImageLibraryViewModel({ creationId });
  const {
    creation,
    images,
    hiddenImages,
    featuredSlots,
    loadStatus,
    loadMessage,
    activeActionKey,
    reload,
    assignFeaturedSlot,
    hideImage,
    showImage,
    filteredVisibleImages,
    pagedVisibleImages,
    hasMoreVisibleImages,
    loadMoreVisibleImages,
    sortMode,
    setSortMode,
    sortOptions,
    eligibilityFilter,
    setEligibilityFilter,
    eligibilityFilterOptions,
  } = libraryState;

  const [activePreviewId, setActivePreviewId] = useState(null);
  const [likedImageIds, setLikedImageIds] = useState(() => new Set());
  const [bookmarkedImageIds, setBookmarkedImageIds] = useState(() => new Set());
  const [reactionMessage, setReactionMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletingImageOutputId, setDeletingImageOutputId] = useState("");
  const [deletedImageOutputIds, setDeletedImageOutputIds] = useState(
    () => new Set()
  );
  // B5 danger-confirm recipe (docs/plans/ED1G-FULL-REVIEW-FINDINGS.md
  // section 2.5): the grid delete controls now route through this
  // modal confirm step instead of window.confirm. The lightbox's own
  // delete action keeps its separate, already-B5 confirm flow
  // (MediaLightbox owns "deletion confirmation" for itself); this
  // state is scoped to the card grid only.
  const [deleteConfirmImageId, setDeleteConfirmImageId] = useState("");
  const libraryPassOwner = useCreationLibraryPassOwnerViewModel({
    creationId,
    publicPreviewFallback: EAGER_IMAGE_COUNT,
  });
  const [reassignmentMessage, setReassignmentMessage] = useState("");

  async function handleRefresh() {
    await Promise.allSettled([
      Promise.resolve(reload?.()),
      libraryPassOwner.reload(),
    ]);
  }

  const isLocallyDeletedImage = useCallback(
    (image) =>
      deletedImageOutputIds.has(getCreationLibraryImageOutputId(image)),
    [deletedImageOutputIds]
  );

  const libraryImages = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter((image) => !isLocallyDeletedImage(image))
        : [],
    [images, isLocallyDeletedImage]
  );

  const hiddenLibraryImages = useMemo(
    () =>
      Array.isArray(hiddenImages)
        ? hiddenImages.filter((image) => !isLocallyDeletedImage(image))
        : [],
    [hiddenImages, isLocallyDeletedImage]
  );

  const visibleFilteredRawImages = useMemo(
    () =>
      Array.isArray(filteredVisibleImages)
        ? filteredVisibleImages.filter(
            (image) => !isLocallyDeletedImage(image)
          )
        : [],
    [filteredVisibleImages, isLocallyDeletedImage]
  );

  const visiblePagedRawImages = useMemo(
    () =>
      Array.isArray(pagedVisibleImages)
        ? pagedVisibleImages.filter((image) => !isLocallyDeletedImage(image))
        : [],
    [pagedVisibleImages, isLocallyDeletedImage]
  );

  const lightboxImages = useMemo(() => {
    const creationOwnerId = String(creation?.ownerId || creation?.owner_id || "").trim();
    const currentCreationId = String(creationId || creation?.id || "").trim();
    return [...libraryImages, ...hiddenLibraryImages].map((image) => {
      const imageOwnerId = String(image?.ownerId || image?.owner_id || "").trim();
      const imageCreationId = String(image?.creationId || image?.creation_id || "").trim();
      return {
        ...image,
        canReassign: Boolean(
          creationOwnerId &&
            currentCreationId &&
            imageOwnerId === creationOwnerId &&
            imageCreationId === currentCreationId &&
            getCreationLibraryImageOutputId(image)
        ),
      };
    });
  }, [creation, creationId, libraryImages, hiddenLibraryImages]);

  const rawImageById = useMemo(() => {
    const map = new Map();
    lightboxImages.forEach((image) => {
      const normalized = normalizeCreationLibraryImage(image);
      map.set(normalized.id, image);
    });
    return map;
  }, [lightboxImages]);

  const reactionImageOutputIdsKey = useMemo(() => {
    const ids = [
      ...new Set(
        lightboxImages.map(getCreationLibraryImageOutputId).filter(Boolean)
      ),
    ];
    return ids.sort().join("|");
  }, [lightboxImages]);

  useEffect(() => {
    const imageOutputIds = reactionImageOutputIdsKey
      ? reactionImageOutputIdsKey.split("|")
      : [];

    if (!imageOutputIds.length) {
      setLikedImageIds(new Set());
      setBookmarkedImageIds(new Set());
      return undefined;
    }

    let cancelled = false;

    fetchMediaReactions(imageOutputIds)
      .then((reactions) => {
        if (cancelled) return;

        setLikedImageIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "LIKE")
              .map((reaction) => reaction.imageOutputId)
          )
        );
        setBookmarkedImageIds(
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
  }, [reactionImageOutputIdsKey]);

  async function toggleLikedImage(image) {
    const imageOutputId = getCreationLibraryImageOutputId(image);
    if (!imageOutputId) {
      setReactionMessage(
        "This image cannot be liked yet because it has no output id."
      );
      return;
    }

    const nextActive = !likedImageIds.has(imageOutputId);
    setReactionMessage("");
    toggleSetItem(setLikedImageIds, imageOutputId);

    try {
      await setMediaLike(imageOutputId, nextActive);
    } catch (error) {
      toggleSetItem(setLikedImageIds, imageOutputId);
      setReactionMessage(error?.message || "Like could not be saved.");
    }
  }

  async function toggleBookmarkedImage(image) {
    const imageOutputId = getCreationLibraryImageOutputId(image);
    if (!imageOutputId) {
      setReactionMessage(
        "This image cannot be bookmarked yet because it has no output id."
      );
      return;
    }

    const nextActive = !bookmarkedImageIds.has(imageOutputId);
    setReactionMessage("");
    toggleSetItem(setBookmarkedImageIds, imageOutputId);

    try {
      await setMediaBookmark(imageOutputId, nextActive);
    } catch (error) {
      toggleSetItem(setBookmarkedImageIds, imageOutputId);
      setReactionMessage(error?.message || "Bookmark could not be saved.");
    }
  }

  async function handleDeleteImage(image) {
    const imageOutputId = getCreationLibraryImageOutputId(image);
    if (!imageOutputId) {
      setDeleteMessage(
        "This image cannot be deleted because it has no output id."
      );
      return;
    }

    setDeleteMessage("");
    setDeletingImageOutputId(imageOutputId);

    try {
      await deleteImageOutput(imageOutputId, {
        deleteReason: "owner_deleted_from_character_library",
      });

      setDeletedImageOutputIds((current) => {
        const next = new Set(current);
        next.add(imageOutputId);
        return next;
      });

      const normalized = normalizeCreationLibraryImage(image);
      if (activePreviewId === normalized.id) setActivePreviewId(null);

      await reload?.();
      setDeleteMessage("Image deleted.");
    } catch (error) {
      setDeleteMessage(error?.message || "Image could not be deleted.");
    } finally {
      setDeletingImageOutputId("");
    }
  }

  function findRawImage(imageId) {
    return rawImageById.get(String(imageId || "")) || null;
  }

  function onToggleLike(imageId) {
    const image = findRawImage(imageId);
    if (image) toggleLikedImage(image);
  }

  function onToggleBookmark(imageId) {
    const image = findRawImage(imageId);
    if (image) toggleBookmarkedImage(image);
  }

  function onDeleteImage(imageId) {
    if (!imageId) return;
    setDeleteMessage("");
    setDeleteConfirmImageId(String(imageId));
  }

  function onCancelDeleteImage() {
    setDeleteConfirmImageId("");
  }

  function onConfirmDeleteImage() {
    const image = findRawImage(deleteConfirmImageId);
    setDeleteConfirmImageId("");
    if (image) handleDeleteImage(image);
  }

  const normalizedVisibleImages = useMemo(
    () =>
      visiblePagedRawImages.map((image, index) => {
        const normalized = normalizeCreationLibraryImage(image, index);
        return {
          ...normalized,
          liked: likedImageIds.has(normalized.imageOutputId),
          bookmarked: bookmarkedImageIds.has(normalized.imageOutputId),
          deleting: deletingImageOutputId === normalized.imageOutputId,
          hideBusy: activeActionKey === `HIDDEN:${normalized.id}`,
          slotActions: FEATURED_SLOT_ORDER.map((slotKey) => ({
            slotKey,
            label: FEATURED_SLOT_LABELS[slotKey],
            active:
              featuredSlots?.[slotKey]?.libraryEntryId === normalized.id,
            busy: activeActionKey === `${slotKey}:${normalized.id}`,
            disabled: !normalized.id,
          })),
        };
      }),
    [
      visiblePagedRawImages,
      likedImageIds,
      bookmarkedImageIds,
      deletingImageOutputId,
      activeActionKey,
      featuredSlots,
    ]
  );

  const normalizedHiddenImages = useMemo(
    () =>
      hiddenLibraryImages.map((image, index) => {
        const normalized = normalizeCreationLibraryImage(image, index);
        return {
          ...normalized,
          liked: likedImageIds.has(normalized.imageOutputId),
          bookmarked: bookmarkedImageIds.has(normalized.imageOutputId),
          deleting: deletingImageOutputId === normalized.imageOutputId,
          showBusy: activeActionKey === `VISIBLE:${normalized.id}`,
        };
      }),
    [
      hiddenLibraryImages,
      likedImageIds,
      bookmarkedImageIds,
      deletingImageOutputId,
      activeActionKey,
    ]
  );

  const featuredSlotCards = useMemo(
    () =>
      FEATURED_SLOT_ORDER.map((slotKey) => {
        const slot = featuredSlots?.[slotKey] || null;
        const rawImage = slot?.image || null;
        const image =
          rawImage && !isLocallyDeletedImage(rawImage)
            ? normalizeCreationLibraryImage(rawImage)
            : null;

        return {
          slotKey,
          label: slot?.label || FEATURED_SLOT_LABELS[slotKey],
          isPrimary: slotKey === "primary",
          image: image
            ? {
                ...image,
                liked: likedImageIds.has(image.imageOutputId),
                bookmarked: bookmarkedImageIds.has(image.imageOutputId),
              }
            : null,
        };
      }),
    [featuredSlots, isLocallyDeletedImage, likedImageIds, bookmarkedImageIds]
  );

  // Type-aware copy input for the B5 delete-confirm modal: whether the
  // pending image currently fills one of the four featured slots, so
  // the confirm copy can warn that deleting it also clears that slot.
  const deleteConfirmIsFeatured = useMemo(
    () =>
      Boolean(
        deleteConfirmImageId &&
          featuredSlotCards.some(
            (slot) => slot.image?.id === deleteConfirmImageId
          )
      ),
    [deleteConfirmImageId, featuredSlotCards]
  );

  const activePreviewItem = activePreviewId
    ? lightboxImages.find(
        (image) => normalizeCreationLibraryImage(image).id === activePreviewId
      )
    : null;

  const shareHref = creationId
    ? `/studio/creations/${encodeURIComponent(creationId)}`
    : "";
  const isShareable = Boolean(
    shareHref && String(creation?.visibility || "").trim().toUpperCase() !== "PRIVATE"
  );

  const imageStudioHref = "/studio/v2/images";

  const lightboxProps = activePreviewItem
    ? {
        items: lightboxImages,
        activeItemId: activePreviewItem.id,
        onSelectItem: (item) =>
          setActivePreviewId(
            item ? normalizeCreationLibraryImage(item).id : null
          ),
        onClose: () => setActivePreviewId(null),
        modeLabel: "Character Library",
        imageStudioHref,
        allowDownload: true,
        showStudioActions: true,
        isItemLiked: (item) =>
          likedImageIds.has(getCreationLibraryImageOutputId(item)),
        isItemBookmarked: (item) =>
          bookmarkedImageIds.has(getCreationLibraryImageOutputId(item)),
        onToggleLike: toggleLikedImage,
        onToggleBookmark: toggleBookmarkedImage,
        onDeleteItem: handleDeleteImage,
        onReassignItem: async (_item, result) => {
          if (result?.coinBalance !== undefined) {
            setCoinBalanceFromServer?.(result.coinBalance);
          }
          setReassignmentMessage(
            result?.destinationTitle
              ? `Image reassigned to ${result.destinationTitle}. 1 Coin used.`
              : "Image reassigned. 1 Coin used."
          );
          setActivePreviewId(null);
          await handleRefresh();
        },
      }
    : null;

  return {
    creationId,
    title: creation?.title || "Image Library",
    backHref: creationId
      ? `/studio/my-creations/${encodeURIComponent(creationId)}/edit`
      : "/studio/my-creations",
    // RULED 11 Aug 2026 (Sprint H render review, item 4): the v2 editor
    // composition (app/studio/v2/editor/ImageLibrary.jsx) already
    // renders its own origin-aware Back; passing showBackLink={false}
    // there removes this legacy control so only one back path exists.
    // Defaults true, unchanged for the legacy
    // /studio/my-creations/[id]/image-library caller, which has no
    // outer back control of its own.
    showBackLink,
    shareHref,
    isShareable,
    imageStudioHref,
    loadStatus,
    loadMessage,
    isLoading: loadStatus === "idle" || loadStatus === "loading",
    reactionMessage,
    deleteMessage,
    reassignmentMessage,
    libraryPassPanel: libraryPassOwner.panel,
    featuredSlotCards,
    visibleImages: normalizedVisibleImages,
    hiddenImages: normalizedHiddenImages,
    hasImages: libraryImages.length > 0,
    noMatchingImages:
      libraryImages.length > 0 && normalizedVisibleImages.length === 0,
    visibleSummary: `Showing ${normalizedVisibleImages.length} of ${
      visibleFilteredRawImages.length
    } / ${normalizedHiddenImages.length} hidden`,
    eligibilityFilter,
    eligibilityFilterOptions: Object.entries(
      eligibilityFilterOptions || {}
    ).map(([value, label]) => ({ value, label })),
    sortMode: sortMode || "newest",
    sortOptions: Object.entries(sortOptions || {}).map(([value, label]) => ({
      value,
      label,
    })),
    hasMoreVisibleImages: Boolean(hasMoreVisibleImages),
    lightboxProps,
    eagerImageCount: EAGER_IMAGE_COUNT,
    onRefresh: handleRefresh,
    onToggleLibraryPassSales: libraryPassOwner.onToggleSales,
    onSetEligibilityFilter: setEligibilityFilter,
    onSetSortMode: setSortMode,
    onLoadMoreVisibleImages: loadMoreVisibleImages,
    onOpenPreview: setActivePreviewId,
    onToggleLike,
    onToggleBookmark,
    onAssignFeaturedSlot: assignFeaturedSlot,
    onHideImage: hideImage,
    onShowImage: showImage,
    onDeleteImage,
    deleteConfirmOpen: Boolean(deleteConfirmImageId),
    deleteConfirmIsFeatured,
    onCancelDeleteImage,
    onConfirmDeleteImage,
  };
}
