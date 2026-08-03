"use client";

import { useEffect, useMemo, useState } from "react";

import { useCreationImageLibraryViewModel } from "@/components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel";

const REFERENCE_BUCKETS = Object.freeze([
  Object.freeze({
    key: "anime",
    field: "anime_image_output_id",
    label: "Anime Reference Image",
    eyebrow: "Anime Reference",
    description:
      "Used for anime, fantasy, and fantasy-realistic render lanes.",
  }),
  Object.freeze({
    key: "realistic",
    field: "realistic_image_output_id",
    label: "Realistic Reference Image",
    eyebrow: "Realistic Reference",
    description:
      "Used for realistic and realistic-fantasy render lanes.",
  }),
]);

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Visual Consistency",
  sectionTitle: "Visual References",
  sectionDescription:
    "Assign one anime reference and one realistic reference from this creation's image library. Image Studio can later choose the correct reference automatically based on render family.",
  refreshLabel: "Refresh Library",
  loadErrorMessage: "Image library could not be loaded.",
});

function normalizeVisualReferences(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

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

function findImageByOutputId(images, imageOutputId) {
  if (!imageOutputId) return null;

  return (images || []).find(
    (image) => getImageOutputId(image) === imageOutputId
  );
}

export function useVisualReferencesSectionViewModel({
  creationId,
  form = {},
  updateDataField = null,
} = {}) {
  const [activePickerKey, setActivePickerKey] = useState(null);
  const { images, loadStatus, reload } = useCreationImageLibraryViewModel({
    creationId,
  });

  useEffect(() => {
    reload?.();
  }, [reload]);

  const visualReferences = useMemo(
    () => normalizeVisualReferences(form?.data?.visual_references),
    [form?.data?.visual_references]
  );

  function updateVisualReference(field, imageOutputId) {
    updateDataField?.("visual_references", {
      ...visualReferences,
      [field]: imageOutputId || null,
    });
  }

  const referenceCards = REFERENCE_BUCKETS.map((bucket) => {
    const imageOutputId = visualReferences?.[bucket.field] || "";
    const selectedImage = findImageByOutputId(images, imageOutputId);

    return {
      key: bucket.key,
      eyebrow: bucket.eyebrow,
      label: bucket.label,
      description: bucket.description,
      imageOutputId,
      imageUrl: getDisplayImageUrl(selectedImage),
      emptyMessage: imageOutputId
        ? "Reference assigned. Preview unavailable until library reloads."
        : "No reference image assigned.",
      chooseLabel: imageOutputId
        ? "Replace Reference"
        : "Choose from Library",
      clearLabel: `Clear ${bucket.label}`,
      onChoose: () => setActivePickerKey(bucket.key),
      onClear: imageOutputId
        ? () => updateVisualReference(bucket.field, null)
        : null,
    };
  });

  const activePicker =
    REFERENCE_BUCKETS.find((bucket) => bucket.key === activePickerKey) || null;

  return {
    ...DEFAULT_COPY,
    creationId,
    loadStatus,
    referenceCards,
    activePicker,
    onRefresh: reload,
    onClosePicker: () => setActivePickerKey(null),
    onSelectReference: ({ imageOutputId } = {}) => {
      if (!activePicker) return;
      updateVisualReference(activePicker.field, imageOutputId);
      setActivePickerKey(null);
    },
  };
}
