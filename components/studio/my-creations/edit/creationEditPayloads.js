import { DEFAULT_CREATION_IMAGE } from "@/lib/shared/creations/creationMedia";
import { normalizePoseDataForPersistence } from "@/lib/shared/creations/poseSemantics";

export function createFallbackForm(creationId) {
  return {
    id: creationId,
    title: "Untitled Creation",
    type: "CHARACTER",
    visibility: "PRIVATE",
    contentRating: "SFW",
    reviewStatus: "DRAFT",
    status: "DRAFT",
    canonStatus: "NONE",
    description: "No description has been added yet.",
    featuredMedia: [
      {
        id: "slot-1",
        label: "Primary",
        imageUrl: DEFAULT_CREATION_IMAGE,
        isPlaceholder: true,
      },
      { id: "slot-2", label: "Alt 1", imageUrl: null },
      { id: "slot-3", label: "Alt 2", imageUrl: null },
      { id: "slot-4", label: "Alt 3", imageUrl: null },
    ],
    chatDisplayMedia: {
      avatar: {
        id: "chat-avatar",
        label: "Chat Avatar",
        imageUrl: null,
      },
      icon: {
        id: "chat-icon",
        label: "Chat Icon",
        imageUrl: null,
      },
    },
    data: {},
  };
}

function getLifecycleStatus(creation, fallback = "DRAFT") {
  return (
    creation?.status ||
    creation?.reviewStatus ||
    creation?.review_status ||
    fallback
  );
}

export function buildSavePayload(form) {
  const data = {
    ...(form.data || {}),
  };
  data.is_creditable = data.is_creditable ?? true;

  const normalizedType = String(form.type || "").toUpperCase();
  if (["CHARACTER", "PLAYER_CHARACTER"].includes(normalizedType)) {
    data.name = form.title || data.name || "";
  }

  if (normalizedType === "POSE") {
    Object.assign(data, normalizePoseDataForPersistence(data));
    data.name = form.title || data.name || "";
  }

  data.visibility = form.visibility;
  data.content_rating = form.contentRating;

  const payload = {
    title: form.title,
    description: form.description,
    content_rating: form.contentRating,
    data,
  };

  if (["PRIVATE", "UNLISTED"].includes(form.visibility)) {
    payload.visibility = form.visibility;
  }

  const lifecycleStatus = getLifecycleStatus(form);

  if (["DRAFT", "ARCHIVED"].includes(lifecycleStatus)) {
    payload.status = lifecycleStatus;
  }

  return payload;
}

export function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function mergeSavedCreationIntoForm(current, savedCreation) {
  if (!savedCreation) return current;

  const lifecycleStatus = getLifecycleStatus(
    savedCreation,
    getLifecycleStatus(current)
  );

  return {
    ...current,
    ...savedCreation,
    title: savedCreation.title || current.title,
    description: savedCreation.description ?? current.description,
    visibility: savedCreation.visibility || current.visibility,
    contentRating: savedCreation.contentRating || current.contentRating,
    reviewStatus: lifecycleStatus,
    status: lifecycleStatus,
    canonStatus: savedCreation.canonStatus || current.canonStatus,
    featuredMedia: savedCreation.featuredMedia || current.featuredMedia,
    chatDisplayMedia:
      savedCreation.chatDisplayMedia || current.chatDisplayMedia,
    data: savedCreation.data || current.data,
  };
}

export function getApiErrorMessage(payload, fallback) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallback
  );
}