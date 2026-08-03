"use client";

import { useEffect, useState } from "react";

import {
  archiveCreation,
  cancelCreationReview,
  deleteCreation,
  fetchOwnedCreation,
  moveCreationToInternalEditing,
  submitCreationReview,
  updateCreationDraft,
} from "@/lib/client/studio/creations/creationClient";
import {
  buildSavePayload,
  createFallbackForm,
  extractCreationFromApiResponse,
  mergeSavedCreationIntoForm,
} from "@/components/studio/my-creations/edit/creationEditPayloads";

const FEATURED_SLOT_ORDER = ["primary", "alt1", "alt2", "alt3"];

const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

function getSelectedImageUrl(image) {
  return (
    image?.displayImageUrl ||
    image?.displayUrl ||
    image?.thumbnailUrl ||
    image?.imageUrl ||
    image?.url ||
    null
  );
}

function createEmptyFeaturedMediaSlot(slotKey, index) {
  return {
    id: `slot-${index + 1}`,
    label: FEATURED_SLOT_LABELS[slotKey] || `Slot ${index + 1}`,
    imageUrl: null,
    url: null,
    isPlaceholder: false,
  };
}

function hasUsableCreation(value, creationId) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  if (value.id !== creationId) {
    return false;
  }

  if (!value.type || !value.title) {
    return false;
  }

  return Boolean(
    value.ownerId ||
      value.owner_id ||
      value.createdAt ||
      value.created_at ||
      value.updatedAt ||
      value.updated_at
  );
}

function getInitialEditForm({ creationId, creation }) {
  return hasUsableCreation(creation, creationId)
    ? creation
    : createFallbackForm(creationId);
}

export function useCreationEditViewModel({ creationId, creation }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeMediaSlot, setActiveMediaSlot] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState("idle");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [form, setForm] = useState(() =>
    getInitialEditForm({ creationId, creation })
  );

  const [archiveStatus, setArchiveStatus] = useState("idle");
  const [archiveMessage, setArchiveMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("idle");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewAction, setReviewAction] = useState(null);
  useEffect(() => {
    let cancelled = false;

    async function hydrateCreation() {
      if (hasUsableCreation(creation, creationId)) {
        setForm(creation);
        setHasUnsavedChanges(false);
        setActiveSection("overview");
        setActiveMediaSlot(0);
        return;
      }

      try {
        const loadedCreation = await fetchOwnedCreation(creationId);

        if (cancelled) return;

        if (hasUsableCreation(loadedCreation, creationId)) {
          setForm(loadedCreation);
        } else {
          setForm(createFallbackForm(creationId));
        }

        setHasUnsavedChanges(false);
        setActiveSection("overview");
        setActiveMediaSlot(0);
      } catch (error) {
        if (cancelled) return;

        setForm(createFallbackForm(creationId));
        setHasUnsavedChanges(false);
        setSaveStatus("error");
        setSaveMessage(error.message || "Creation could not be loaded.");
      }
    }

    hydrateCreation();

    return () => {
      cancelled = true;
    };
  }, [creationId, creation]);

  function updateField(field, value) {
    setHasUnsavedChanges(true);
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "title" && current.type === "CHARACTER") {
        next.data = {
          ...(current.data || {}),
          name: value,
        };
      }

      return next;
    });
  }

  function updateDataField(field, value) {
    setHasUnsavedChanges(true);
    setForm((current) => {
      const nextData = {
        ...(current.data || {}),
        [field]: value,
      };

      const next = {
        ...current,
        data: nextData,
      };

      if (field === "name") {
        next.title = value || "Untitled Creation";
      }

      return next;
    });
  }
  function updateFeaturedMediaSlot(slotKey, selectedImage) {
    const normalizedSlotKey = String(slotKey || "").trim().toLowerCase();
    const slotIndex = FEATURED_SLOT_ORDER.indexOf(normalizedSlotKey);

    if (slotIndex < 0) return;

    setHasUnsavedChanges(true);
    const imageUrl = getSelectedImageUrl(selectedImage);

    setForm((current) => {
      const nextFeaturedMedia = Array.isArray(current.featuredMedia)
        ? [...current.featuredMedia]
        : [];

      while (nextFeaturedMedia.length < FEATURED_SLOT_ORDER.length) {
        const nextIndex = nextFeaturedMedia.length;
        const nextSlotKey = FEATURED_SLOT_ORDER[nextIndex];

        nextFeaturedMedia.push(
          createEmptyFeaturedMediaSlot(nextSlotKey, nextIndex)
        );
      }

      const currentSlot =
        nextFeaturedMedia[slotIndex] ||
        createEmptyFeaturedMediaSlot(normalizedSlotKey, slotIndex);

      nextFeaturedMedia[slotIndex] = {
        ...currentSlot,
        id: selectedImage?.id || currentSlot.id || `slot-${slotIndex + 1}`,
        label:
          currentSlot.label ||
          FEATURED_SLOT_LABELS[normalizedSlotKey] ||
          `Slot ${slotIndex + 1}`,
        imageUrl,
        url: imageUrl,
        title: selectedImage?.title || current.title || currentSlot.title,
        libraryEntryId:
          selectedImage?.libraryEntryId || selectedImage?.id || null,
        imageOutputId: selectedImage?.imageOutputId || null,
        storagePath: selectedImage?.storagePath || null,
        storageProvider: selectedImage?.storageProvider || null,
        contentRating: selectedImage?.contentRating || null,
        isPlaceholder: false,
      };

      const nextData = {
        ...(current.data || {}),
        featuredMedia: nextFeaturedMedia,
        featured_media: nextFeaturedMedia,
      };

      return {
        ...current,
        featuredMedia: nextFeaturedMedia,
        featured_media: nextFeaturedMedia,
        data: nextData,
      };
    });
  }
  async function handleSave() {
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await updateCreationDraft(
        creationId,
        buildSavePayload(form)
      );

      const savedCreation = extractCreationFromApiResponse(payload);

      setForm((current) => mergeSavedCreationIntoForm(current, savedCreation));
      setHasUnsavedChanges(false);
      setSaveStatus("saved");
      setSaveMessage("Saved.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error.message || "Creation could not be saved.");
    }
  }

  async function handleCancelReview() {
    setReviewStatus("saving");
    setReviewMessage("");

    try {
      const payload = await cancelCreationReview(creationId);
      const cancelledCreation = extractCreationFromApiResponse(payload);

      setForm((current) =>
        mergeSavedCreationIntoForm(current, cancelledCreation)
      );

      setReviewStatus("cancelled");
      setReviewMessage(
        "Review cancelled. This creation is now internal/unlisted and editable."
      );
    } catch (error) {
      setReviewStatus("error");
      setReviewMessage(error.message || "Review could not be cancelled.");
    }
  }

  async function handleUnlistForEditing() {
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await moveCreationToInternalEditing(creationId);
      const savedCreation = extractCreationFromApiResponse(payload);

      setForm((current) => mergeSavedCreationIntoForm(current, savedCreation));
      setSaveStatus("saved");
      setSaveMessage(
        "Unlisted for editing. Changes can now be saved; returning to public discovery will require review again."
      );
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error.message || "Creation could not be moved to internal editing."
      );
    }
  }

  async function handleSubmitReview(reviewType) {
    const normalizedReviewType = String(reviewType || "").toUpperCase();

    setReviewStatus("saving");
    setReviewAction(normalizedReviewType);
    setReviewMessage("");

    try {
      const payload = await submitCreationReview(
        creationId,
        normalizedReviewType
      );

      const submittedCreation = extractCreationFromApiResponse(payload);

      setForm((current) =>
        mergeSavedCreationIntoForm(current, submittedCreation)
      );

      setReviewStatus("submitted");
      setReviewMessage(
        normalizedReviewType === "CANON"
          ? "Submitted for canon review."
          : "Submitted for public review."
      );
    } catch (error) {
      setReviewStatus("error");
      setReviewMessage(error.message || "Creation could not be submitted.");
    } finally {
      setReviewAction(null);
    }
  }

  async function handleArchive() {
    setArchiveStatus("saving");
    setArchiveMessage("");

    try {
      const payload = await archiveCreation(creationId);
      const archivedCreation = extractCreationFromApiResponse(payload);

      setForm((current) =>
        mergeSavedCreationIntoForm(current, archivedCreation)
      );
      setArchiveStatus("archived");
      setArchiveMessage("Archived.");
    } catch (error) {
      setArchiveStatus("error");
      setArchiveMessage(error.message || "Creation could not be archived.");
    }
  }
    async function handleDelete() {
    const confirmed = window.confirm(
        "Permanently delete this creation? This is only allowed for non-canon draft or archived creations."
    );

    if (!confirmed) return;

    setDeleteStatus("saving");
    setDeleteMessage("");

    try {
        await deleteCreation(creationId);

        setDeleteStatus("deleted");
        setDeleteMessage("Deleted.");

        window.location.assign("/studio/my-creations");
    } catch (error) {
        setDeleteStatus("error");
        setDeleteMessage(error.message || "Creation could not be deleted.");
    }
}
  return {
    activeSection,
    setActiveSection,
    activeMediaSlot,
    setActiveMediaSlot,
    form,
    hasUnsavedChanges,
    updateField,
    updateDataField,
    updateFeaturedMediaSlot,
    archiveStatus,
    archiveMessage,
    saveStatus,
    saveMessage,
    reviewStatus,
    reviewMessage,
    reviewAction,
    handleSave,
    handleCancelReview,
    handleUnlistForEditing,
    handleSubmitReview,
    handleArchive,
    deleteStatus,
    deleteMessage,
    handleDelete,
  };
}