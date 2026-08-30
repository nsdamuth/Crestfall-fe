"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  fetchCreationImageLibrary,
  setCreationFeaturedImageSlot,
  setCreationStockFeaturedImageSlot,
} from "@/lib/client/studio/creations/creationClient";

const IMAGE_PAGE_SIZE = 12;
const STOCK_ALL_CATEGORY = "all";

const STOCK_CATEGORY_ORDER = Object.freeze([
  "Figures & Portraits",
  "Worlds & Places",
  "Story & Lore",
  "Objects & Wardrobe",
  "Art & Ornament",
]);

const SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

const SOURCE_OPTIONS = Object.freeze([
  Object.freeze({ id: "library", label: "Your Images" }),
  Object.freeze({ id: "stock", label: "Crestfall Stock" }),
]);

const ORIENTATION_LABELS = Object.freeze({
  portrait: "Portrait cover",
  landscape: "Landscape cover",
  square: "Square cover",
});

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
    image?.imageUrl ||
    image?.url ||
    image?.thumbnailImageUrl ||
    image?.thumbnailUrl ||
    image?.src ||
    null
  );
}

function getImageOutputId(image) {
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

function getPickerThumbnailUrl(image) {
  if (!image) return null;

  if (image?.isStockMedia) {
    return getImageUrl(image);
  }

  const imageOutputId = getImageOutputId(image);
  const proxiedThumbnailUrl = imageOutputId
    ? `/api/studio/image-generation/outputs/${encodeURIComponent(
        imageOutputId
      )}/file?variant=thumbnail`
    : null;

  return (
    image?.thumbnailImageUrl ||
    image?.thumbnailUrl ||
    proxiedThumbnailUrl ||
    getImageUrl(image)
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
    isStockMedia: Boolean(image?.isStockMedia),
    isPlaceholder: Boolean(image?.isPlaceholder),
  };
}

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function toViewImage(image) {
  const isStockMedia = Boolean(image?.isStockMedia);
  const stockTags = Array.isArray(image?.tags) ? image.tags.filter(Boolean) : [];
  const category = isStockMedia ? String(image?.category || "Crestfall Stock") : "";
  const orientation = isStockMedia
    ? ORIENTATION_LABELS[String(image?.orientation || "").toLowerCase()] || "Cover artwork"
    : "";

  return {
    id: image?.id || "",
    title: image?.title || "",
    // The picker is a browsing grid, not the full-resolution viewer. Prefer
    // the thumbnail/card-sized media path so opening a large library does not
    // trigger a burst of original/display image downloads.
    displayImageUrl: getPickerThumbnailUrl(image) || "",
    altText: isStockMedia
      ? image?.title || "Crestfall Stock image"
      : "Eligible creation library image",
    description: isStockMedia ? image?.description || "" : "",
    category,
    orientationLabel: orientation,
    tags: stockTags,
    metadataLabel: isStockMedia
      ? [category, orientation].filter(Boolean).join(" · ")
      : `${image?.contentRating || "SFW"} · ${
          image?.moderationStatus || "CLEAR"
        }`,
    isStockMedia,
    isSelected: Boolean(image?.isSelected),
  };
}

function stockImageMatchesQuery(image, query) {
  if (!query) return true;

  const haystack = [
    image?.title,
    image?.category,
    image?.description,
    ...(Array.isArray(image?.tags) ? image.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function getCurrentFeaturedSelection(imageLibrary, slotKey) {
  const stockMediaId = String(
    imageLibrary?.stockFeaturedSlots?.[slotKey] || ""
  ).trim();

  if (stockMediaId) {
    return { source: "stock", id: stockMediaId };
  }

  const featuredSlot = imageLibrary?.featuredSlots?.[slotKey] || null;
  const libraryEntryId = String(
    featuredSlot?.libraryEntryId || featuredSlot?.image?.id || ""
  ).trim();

  return libraryEntryId
    ? { source: "library", id: libraryEntryId }
    : null;
}

function prioritizeSelectedImage(images, selectedImageId) {
  if (!selectedImageId) return images;

  const selectedIndex = images.findIndex((image) => image?.id === selectedImageId);
  if (selectedIndex <= 0) return images;

  return [
    images[selectedIndex],
    ...images.slice(0, selectedIndex),
    ...images.slice(selectedIndex + 1),
  ];
}

function sortStockCategories(categories) {
  return [...categories].sort((a, b) => {
    const aIndex = STOCK_CATEGORY_ORDER.indexOf(a);
    const bIndex = STOCK_CATEGORY_ORDER.indexOf(b);

    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }

    return a.localeCompare(b);
  });
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
  const [stockImages, setStockImages] = useState([]);
  const [sourceMode, setSourceMode] = useState("library");
  const [stockSearch, setStockSearch] = useState("");
  const [stockCategory, setStockCategory] = useState(STOCK_ALL_CATEGORY);
  const [visibleCount, setVisibleCount] = useState(IMAGE_PAGE_SIZE);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [loadMessage, setLoadMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const sourceInitializedRef = useRef(false);

  useEffect(() => {
    sourceInitializedRef.current = false;
    setCurrentSelection(null);
    setSourceMode("library");
    setStockSearch("");
    setStockCategory(STOCK_ALL_CATEGORY);
  }, [creationId, normalizedSlotKey]);

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

      const availableStockImages = (imageLibrary.stockMedia || [])
        .map((image) =>
          normalizeImage({
            ...image,
            isStockMedia: true,
            isPlaceholder: false,
          })
        )
        .filter((image) => image?.id && image?.displayImageUrl);

      const nextCurrentSelection = getCurrentFeaturedSelection(
        imageLibrary,
        normalizedSlotKey
      );

      setImages(eligibleImages);
      setStockImages(availableStockImages);
      setCurrentSelection(nextCurrentSelection);

      if (!sourceInitializedRef.current) {
        setSourceMode(nextCurrentSelection?.source || "library");
        sourceInitializedRef.current = true;
      }

      setVisibleCount(IMAGE_PAGE_SIZE);
      setLoadStatus("loaded");
    } catch (error) {
      setLoadStatus("error");
      setLoadMessage(error.message || "Image library could not be loaded.");
    }
  }, [creationId, normalizedSlotKey]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    setVisibleCount(IMAGE_PAGE_SIZE);
    setSaveMessage("");
  }, [sourceMode]);

  useEffect(() => {
    setVisibleCount(IMAGE_PAGE_SIZE);
  }, [stockSearch, stockCategory]);

  const stockFilterOptions = useMemo(() => {
    const categories = new Set(
      stockImages.map((image) => String(image?.category || "").trim()).filter(Boolean)
    );

    return [
      { id: STOCK_ALL_CATEGORY, label: "All" },
      ...sortStockCategories(categories).map((category) => ({
        id: category,
        label: category,
      })),
    ];
  }, [stockImages]);

  const filteredStockImages = useMemo(() => {
    const query = normalizeSearchValue(stockSearch);

    return stockImages.filter((image) => {
      const matchesCategory =
        stockCategory === STOCK_ALL_CATEGORY || image?.category === stockCategory;

      return matchesCategory && stockImageMatchesQuery(image, query);
    });
  }, [stockCategory, stockImages, stockSearch]);

  const activeSourceImages = sourceMode === "stock" ? filteredStockImages : images;
  const selectedImageIdForSource =
    currentSelection?.source === sourceMode ? currentSelection.id : null;

  const orderedActiveSourceImages = useMemo(
    () => prioritizeSelectedImage(activeSourceImages, selectedImageIdForSource),
    [activeSourceImages, selectedImageIdForSource]
  );

  const visibleImages = useMemo(
    () =>
      orderedActiveSourceImages.slice(0, visibleCount).map((image) =>
        toViewImage({
          ...image,
          isSelected: image?.id === selectedImageIdForSource,
        })
      ),
    [orderedActiveSourceImages, selectedImageIdForSource, visibleCount]
  );

  const hasMoreImages = visibleCount < orderedActiveSourceImages.length;
  const isLoading = loadStatus === "idle" || loadStatus === "loading";
  const hasActiveStockFilters =
    Boolean(normalizeSearchValue(stockSearch)) || stockCategory !== STOCK_ALL_CATEGORY;

  function loadMoreImages() {
    setVisibleCount((current) => current + IMAGE_PAGE_SIZE);
  }

  function clearStockFilters() {
    setStockSearch("");
    setStockCategory(STOCK_ALL_CATEGORY);
  }

  async function selectImage(imageId) {
    const sourceImages = sourceMode === "stock" ? stockImages : images;
    const image = sourceImages.find((candidate) => candidate?.id === imageId);

    if (!image?.id) return;

    if (
      currentSelection?.source === sourceMode &&
      currentSelection?.id === image.id
    ) {
      setSaveStatus("saved");
      setSaveMessage(`${slotLabel} already uses this image.`);
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");
    setActiveImageId(image.id);

    try {
      const payload =
        sourceMode === "stock"
          ? await setCreationStockFeaturedImageSlot(
              creationId,
              normalizedSlotKey,
              image.id
            )
          : await setCreationFeaturedImageSlot(
              creationId,
              normalizedSlotKey,
              image.id
            );

      const savedImage = normalizeImage(extractSavedImageFromPayload(payload));
      const candidateDisplayImageUrl = getImageUrl(image);
      const savedDisplayImageUrl = getImageUrl(savedImage);
      const selectedImage = normalizeImage({
        ...image,
        ...(savedImage || {}),
        // Slot-write responses are allowed to be compact and may omit or null
        // media URLs. Do not let those sparse response fields erase the image
        // the user just selected; the editor needs that candidate URL for the
        // immediate in-place hero/thumbnail projection.
        displayImageUrl: savedDisplayImageUrl || candidateDisplayImageUrl,
        displayUrl:
          savedImage?.displayUrl || image?.displayUrl || candidateDisplayImageUrl,
        thumbnailImageUrl:
          savedImage?.thumbnailImageUrl || image?.thumbnailImageUrl || null,
        thumbnailUrl: savedImage?.thumbnailUrl || image?.thumbnailUrl || null,
        imageUrl:
          savedImage?.imageUrl || image?.imageUrl || candidateDisplayImageUrl,
        url: savedImage?.url || image?.url || candidateDisplayImageUrl,
        id: savedImage?.id || image.id,
        libraryEntryId:
          sourceMode === "stock" ? null : savedImage?.id || image.id,
        stockMediaId:
          sourceMode === "stock" ? savedImage?.stockMediaId || image.id : null,
        isStockMedia: sourceMode === "stock",
        isPlaceholder: false,
      });

      onSelected?.({
        slotKey: normalizedSlotKey,
        slotLabel,
        image: selectedImage,
      });

      setCurrentSelection({ source: sourceMode, id: image.id });
      sourceInitializedRef.current = true;
      setSaveStatus("saved");
      setSaveMessage(
        sourceMode === "stock"
          ? `${slotLabel} updated from Crestfall Stock.`
          : `${slotLabel} updated.`
      );
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error.message || "Featured image slot could not be saved.");
    } finally {
      setActiveImageId(null);
    }
  }

  return {
    slotLabel,
    sourceOptions: SOURCE_OPTIONS,
    activeSource: sourceMode,
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
    searchValue: sourceMode === "stock" ? stockSearch : "",
    searchPlaceholder:
      sourceMode === "stock" ? "Search stock by title, tag, or use..." : "",
    filterOptions: sourceMode === "stock" ? stockFilterOptions : [],
    activeFilter: sourceMode === "stock" ? stockCategory : STOCK_ALL_CATEGORY,
    resultsLabel:
      sourceMode === "stock"
        ? `${filteredStockImages.length} of ${stockImages.length} stock images`
        : "",
    showClearFilters: sourceMode === "stock" && hasActiveStockFilters,
    emptyTitle:
      sourceMode === "stock"
        ? hasActiveStockFilters
          ? "No stock images match"
          : "Stock library unavailable"
        : "No eligible images",
    emptyMessage:
      sourceMode === "stock"
        ? hasActiveStockFilters
          ? "Try another search term or clear the category filters."
          : "Crestfall Stock could not be loaded for this creation."
        : "Generate images for this creation first, or restore/approve images in the creation image library.",
    helperText:
      sourceMode === "stock"
        ? "Choose Crestfall-owned artwork by title, category, or tag. Stock artwork is used only because you selected it explicitly."
        : "Choose an eligible image from this creation’s image library. Flagged, hidden, or unapproved images are not shown here.",
    onClose,
    onRefresh: loadImages,
    onSourceChange: setSourceMode,
    onSearchChange: setStockSearch,
    onFilterChange: setStockCategory,
    onClearFilters: clearStockFilters,
    onLoadMore: loadMoreImages,
    onChooseImage: selectImage,
  };
}
