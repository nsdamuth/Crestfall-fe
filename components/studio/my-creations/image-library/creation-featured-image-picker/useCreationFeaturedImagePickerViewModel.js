"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchCreationImageLibrary,
  setCreationFeaturedImageSlot,
} from "@/lib/client/studio/creations/creationClient";

const IMAGE_PAGE_SIZE = 12;

const SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

function extractImageLibraryFromPayload(payload) {
  return payload?.data?.imageLibrary || payload?.imageLibrary || null;
}

function extractSavedImageFromPayload(payload) {
  return payload?.data?.image || payload?.image || null;
}

function getImageUrl(image) {
  return (
    image?.displayImageUrl ||
    image?.displayUrl ||
    image?.thumbnailUrl ||
    image?.imageUrl ||
    image?.url ||
    null
  );
}

function normalizeImage(image) {
  if (!image) return null;

  const displayImageUrl = getImageUrl(image);

  return {
    ...image,
    displayImageUrl,
    imageUrl: displayImageUrl,
    url: displayImageUrl,
  };
}

function toViewImage(image) {
  return {
    id: image?.id || "",
    displayImageUrl: image?.displayImageUrl || "",
    altText: "Eligible character library image",
    metadataLabel: `${image?.contentRating || "SFW"} · ${
      image?.moderationStatus || "CLEAR"
    }`,
  };
}

export function useCreationFeaturedImagePickerViewModel({
  creationId,
  slotKey,
  onClose,
  onSelected,
}) {
  const normalizedSlotKey = String(slotKey || "primary").trim().toLowerCase();
  const slotLabel = SLOT_LABELS[normalizedSlotKey] || "Featured Slot";

  const [images, setImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(IMAGE_PAGE_SIZE);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [loadMessage, setLoadMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);

  const loadImages = useCallback(async () => {
    if (!creationId) return;

    setLoadStatus("loading");
    setLoadMessage("");

    try {
      const payload = await fetchCreationImageLibrary(creationId);
      const imageLibrary = extractImageLibraryFromPayload(payload);

      if (!imageLibrary) {
        throw new Error("Image library response was empty.");
      }

      const eligibleImages = (imageLibrary.images || [])
        .filter((image) => image.canUseAsFeatured)
        .map(normalizeImage)
        .filter((image) => image?.displayImageUrl)
        .sort((a, b) => {
          const bDate = new Date(
            b.outputCreatedAt || b.createdAt || b.updatedAt || 0
          ).getTime();

          const aDate = new Date(
            a.outputCreatedAt || a.createdAt || a.updatedAt || 0
          ).getTime();

          return bDate - aDate;
        });

      setImages(eligibleImages);
      setVisibleCount(IMAGE_PAGE_SIZE);
      setLoadStatus("loaded");
    } catch (error) {
      setLoadStatus("error");
      setLoadMessage(error.message || "Image library could not be loaded.");
    }
  }, [creationId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const visibleImages = useMemo(
    () => images.slice(0, visibleCount).map(toViewImage),
    [images, visibleCount]
  );

  const hasMoreImages = visibleCount < images.length;
  const isLoading = loadStatus === "idle" || loadStatus === "loading";

  function loadMoreImages() {
    setVisibleCount((current) => current + IMAGE_PAGE_SIZE);
  }

  async function selectImage(imageId) {
    const image = images.find((candidate) => candidate?.id === imageId);

    if (!image?.id) return;

    setSaveStatus("saving");
    setSaveMessage("");
    setActiveImageId(image.id);

    try {
      const payload = await setCreationFeaturedImageSlot(
        creationId,
        normalizedSlotKey,
        image.id
      );

      const savedImage = normalizeImage(extractSavedImageFromPayload(payload));
      const selectedImage = normalizeImage({
        ...image,
        ...(savedImage || {}),
        id: savedImage?.id || image.id,
        libraryEntryId: savedImage?.id || image.id,
      });

      onSelected?.({
        slotKey: normalizedSlotKey,
        slotLabel,
        image: selectedImage,
      });

      setSaveStatus("saved");
      setSaveMessage(`${slotLabel} updated.`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error.message || "Featured image slot could not be saved.");
    } finally {
      setActiveImageId(null);
    }
  }

  return {
    slotLabel,
    images: visibleImages,
    isLoading,
    loadErrorMessage:
      loadStatus === "error"
        ? loadMessage || "Image library could not be loaded."
        : "",
    saveMessage,
    saveMessageTone: saveStatus === "error" ? "error" : "notice",
    activeImageId,
    hasMoreImages,
    refreshDisabled: isLoading,
    onClose,
    onRefresh: loadImages,
    onLoadMore: loadMoreImages,
    onChooseImage: selectImage,
  };
}
