"use client";

import { useEffect, useMemo } from "react";

import { useCreationImageLibraryViewModel } from "../hooks/useCreationImageLibraryViewModel";

function getImageOutputId(image) {
  return (
    image?.imageOutputId ||
    image?.image_output_id ||
    image?.outputId ||
    image?.output_id ||
    ""
  );
}

function getDisplayImageUrl(image) {
  return (
    image?.displayImageUrl ||
    image?.displayUrl ||
    image?.thumbnailUrl ||
    image?.imageUrl ||
    image?.url ||
    null
  );
}

function getSelectionId(image) {
  return (
    image?.id ||
    image?.libraryEntryId ||
    image?.library_entry_id ||
    getImageOutputId(image)
  );
}

function toViewImage(image) {
  return {
    id: getSelectionId(image),
    displayImageUrl: getDisplayImageUrl(image) || "",
    altText: "Eligible visual reference",
    metadataLabel: `${image?.contentRating || "SFW"} · ${
      image?.moderationStatus || "CLEAR"
    }`,
  };
}

export function useCreationReferenceImagePickerViewModel({
  creationId,
  referenceLabel = "Reference Image",
  onClose,
  onSelected,
}) {
  const {
    loadStatus,
    loadMessage,
    reload,
    pagedVisibleImages,
    hasMoreVisibleImages,
    loadMoreVisibleImages,
  } = useCreationImageLibraryViewModel({ creationId });

  useEffect(() => {
    reload?.();
  }, [reload]);

  const eligibleImages = useMemo(
    () =>
      (pagedVisibleImages || []).filter(
        (image) => image.canUseAsFeatured !== false && getImageOutputId(image)
      ),
    [pagedVisibleImages]
  );

  const images = useMemo(
    () => eligibleImages.map(toViewImage),
    [eligibleImages]
  );

  const isLoading = loadStatus === "idle" || loadStatus === "loading";

  function chooseImage(selectionId) {
    const image = eligibleImages.find(
      (candidate) => getSelectionId(candidate) === selectionId
    );
    const imageOutputId = getImageOutputId(image);

    if (!image || !imageOutputId) return;

    onSelected?.({
      image,
      imageOutputId,
    });
  }

  return {
    referenceLabel,
    images,
    isLoading,
    loadErrorMessage:
      loadStatus === "error"
        ? loadMessage || "Image library could not be loaded."
        : "",
    hasMoreImages: hasMoreVisibleImages,
    refreshDisabled: isLoading,
    onClose,
    onRefresh: reload,
    onLoadMore: loadMoreVisibleImages,
    onChooseImage: chooseImage,
  };
}
