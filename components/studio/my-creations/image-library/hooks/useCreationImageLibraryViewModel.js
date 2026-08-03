"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchCreationImageLibrary,
  setCreationFeaturedImageSlot,
  updateCreationImageLibraryEntry,
} from "@/lib/client/studio/creations/creationClient";

const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};
const VISIBLE_IMAGE_PAGE_SIZE = 12;

const SORT_LABELS = {
  newest: "Newest",
  oldest: "Oldest",
  eligible_first: "Eligible First",
  blocked_first: "Needs Review First",
};

const FILTER_LABELS = {
  all: "All",
  eligible: "Eligible",
  blocked: "Blocked",
};
function extractImageLibraryFromPayload(payload) {
  return payload?.data?.imageLibrary || payload?.imageLibrary || null;
}

function normalizeImages(images = []) {
  return images.map(normalizeImage);
}

function normalizeImage(image) {
  if (!image) return null;

  return {
    ...image,
    displayImageUrl:
      image.displayImageUrl ||
      image.displayUrl ||
      image.thumbnailUrl ||
      image.imageUrl ||
      image.url ||
      null,
  };
}

function normalizeFeaturedSlot(slotKey, slot) {
  return {
    slotKey,
    label: slot?.label || FEATURED_SLOT_LABELS[slotKey],
    libraryEntryId: slot?.libraryEntryId || null,
    assignedByUserId: slot?.assignedByUserId || null,
    assignedAt: slot?.assignedAt || null,
    image: normalizeImage(slot?.image || null),
  };
}

function normalizeFeaturedSlots(featuredSlots = {}) {
  return {
    primary: normalizeFeaturedSlot("primary", featuredSlots.primary),
    alt1: normalizeFeaturedSlot("alt1", featuredSlots.alt1),
    alt2: normalizeFeaturedSlot("alt2", featuredSlots.alt2),
    alt3: normalizeFeaturedSlot("alt3", featuredSlots.alt3),
  };
}

export function useCreationImageLibraryViewModel({ creationId }) {
  const [library, setLibrary] = useState(null);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [loadMessage, setLoadMessage] = useState("");
  const [actionStatus, setActionStatus] = useState("idle");
  const [actionMessage, setActionMessage] = useState("");
  const [activeActionKey, setActiveActionKey] = useState(null);
  const [visibleImageCount, setVisibleImageCount] = useState(VISIBLE_IMAGE_PAGE_SIZE);
    const [sortMode, setSortMode] = useState("newest");
    const [eligibilityFilter, setEligibilityFilter] = useState("all");

  const loadLibrary = useCallback(async () => {
    if (!creationId) return;

    setLoadStatus("loading");
    setLoadMessage("");

    try {
      const payload = await fetchCreationImageLibrary(creationId);
      const imageLibrary = extractImageLibraryFromPayload(payload);

      if (!imageLibrary) {
        throw new Error("Image library response was empty.");
      }

      setLibrary({
        ...imageLibrary,
        images: normalizeImages(imageLibrary.images || []),
        featuredSlots: normalizeFeaturedSlots(imageLibrary.featuredSlots || {}),
      });

      setLoadStatus("loaded");
    } catch (error) {
      setLoadStatus("error");
      setLoadMessage(error.message || "Image library could not be loaded.");
    }
  }, [creationId]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    setVisibleImageCount(VISIBLE_IMAGE_PAGE_SIZE);
  }, [sortMode, eligibilityFilter]);
  const visibleImages = useMemo(
  () =>
    (library?.images || []).filter(
      (image) => image.libraryVisibility === "VISIBLE"
    ),
  [library]
);

const hiddenImages = useMemo(
  () =>
    (library?.images || []).filter(
      (image) => image.libraryVisibility === "HIDDEN"
    ),
  [library]
);

const featuredEligibleImages = useMemo(
  () => (library?.images || []).filter((image) => image.canUseAsFeatured),
  [library]
);

const filteredVisibleImages = useMemo(() => {
  const baseImages = visibleImages.filter((image) => {
    if (eligibilityFilter === "eligible") {
      return image.canUseAsFeatured;
    }

    if (eligibilityFilter === "blocked") {
      return !image.canUseAsFeatured;
    }

    return true;
  });

  return [...baseImages].sort((a, b) => {
    if (sortMode === "oldest") {
      return new Date(a.outputCreatedAt || a.createdAt || 0) - new Date(b.outputCreatedAt || b.createdAt || 0);
    }

    if (sortMode === "eligible_first") {
      return Number(b.canUseAsFeatured) - Number(a.canUseAsFeatured);
    }

    if (sortMode === "blocked_first") {
      return Number(a.canUseAsFeatured) - Number(b.canUseAsFeatured);
    }

    return new Date(b.outputCreatedAt || b.createdAt || 0) - new Date(a.outputCreatedAt || a.createdAt || 0);
  });
}, [visibleImages, eligibilityFilter, sortMode]);

const pagedVisibleImages = useMemo(
  () => filteredVisibleImages.slice(0, visibleImageCount),
  [filteredVisibleImages, visibleImageCount]
);

const hasMoreVisibleImages = visibleImageCount < filteredVisibleImages.length;

function loadMoreVisibleImages() {
  setVisibleImageCount((current) => current + VISIBLE_IMAGE_PAGE_SIZE);
}

  async function assignFeaturedSlot(slotKey, libraryEntryId) {
    const normalizedSlotKey = String(slotKey || "").trim().toLowerCase();

    setActionStatus("saving");
    setActionMessage("");
    setActiveActionKey(`${normalizedSlotKey}:${libraryEntryId}`);

    try {
      await setCreationFeaturedImageSlot(
        creationId,
        normalizedSlotKey,
        libraryEntryId
      );

      await loadLibrary();

      setActionStatus("saved");
      setActionMessage(
        `${FEATURED_SLOT_LABELS[normalizedSlotKey] || "Featured slot"} updated.`
      );
    } catch (error) {
      setActionStatus("error");
      setActionMessage(
        error.message || "Featured image slot could not be saved."
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  async function setLibraryVisibility(entryId, libraryVisibility) {
    const normalizedVisibility = String(libraryVisibility || "")
      .trim()
      .toUpperCase();

    setActionStatus("saving");
    setActionMessage("");
    setActiveActionKey(`${normalizedVisibility}:${entryId}`);

    try {
      await updateCreationImageLibraryEntry(creationId, entryId, {
        libraryVisibility: normalizedVisibility,
      });

      await loadLibrary();

      setActionStatus("saved");
      setActionMessage(
        normalizedVisibility === "HIDDEN"
          ? "Image hidden from character library."
          : "Image restored to character library."
      );
    } catch (error) {
      setActionStatus("error");
      setActionMessage(
        error.message || "Image library entry could not be updated."
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  return {
    library,
    creation: library?.creation || null,
    images: library?.images || [],

    visibleImages,
    hiddenImages,
    featuredEligibleImages,
    filteredVisibleImages,
    pagedVisibleImages,
    hasMoreVisibleImages,
    visibleImageCount,

    featuredSlots: library?.featuredSlots || normalizeFeaturedSlots(),

    sortMode,
    setSortMode,
    sortOptions: SORT_LABELS,

    eligibilityFilter,
    setEligibilityFilter,
    eligibilityFilterOptions: FILTER_LABELS,

    loadStatus,
    loadMessage,
    actionStatus,
    actionMessage,
    activeActionKey,

    reload: loadLibrary,
    loadMoreVisibleImages,
    assignFeaturedSlot,
    hideImage: (entryId) => setLibraryVisibility(entryId, "HIDDEN"),
    showImage: (entryId) => setLibraryVisibility(entryId, "VISIBLE"),
  };
}