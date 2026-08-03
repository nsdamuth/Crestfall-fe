import { attachFeaturedImageSlotsToCreationRows } from "@/lib/server/services/creations/attachFeaturedImageSlotsToCreationRows";
import {
  buildFeaturedMedia,
  isPlainObject,
} from "@/lib/shared/creations/creationMedia";

import {
  applyOwnerAttribution,
  getOwnerAttributionById,
} from "@/lib/server/services/creations/creationAttribution";

function getChatDisplayMedia(data) {
  return (
    data.chatDisplayMedia ||
    data.chat_display_media || {
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
    }
  );
}

export function toCreationEditPayload(row) {
  const data = isPlainObject(row.data) ? row.data : {};
  const title = row.title || data.title || data.name || "Untitled Creation";
  const featuredMedia = buildFeaturedMedia({
  row,
  data,
  title,
  max: 4,
  padTo: 4,
  usePlaceholder: true,
  idPrefix: "slot",
});

  return {
    id: row.id,
    ownerId: row.owner_id,
    type: row.type,
    title,
    slug: row.slug,
    description:
      row.description ||
      data.description ||
      data.summary ||
      "No description has been added yet.",
    visibility: row.visibility || data.visibility || "PRIVATE",
    status: row.status || data.status || "DRAFT",
    reviewStatus: row.status || data.status || "DRAFT",
    contentRating:
      row.content_rating ||
      row.contentRating ||
      data.content_rating ||
      data.contentRating ||
      "SFW",
    canonStatus:
      row.canon_status ||
      row.canonStatus ||
      data.canon_status ||
      data.canonStatus ||
      "NONE",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    featuredMedia,
    chatDisplayMedia: getChatDisplayMedia(data),
    data,
  };
}

export async function getOwnedCreationForEdit({
  creationRepository,
  ownerId,
  creationId,
}) {
  const { data, error } = await creationRepository.getOwnedById({
    ownerId,
    creationId,
  });
console.log("[getOwnedCreationForEdit] raw data shape", {
  hasData: Boolean(data),
  keys: data && typeof data === "object" ? Object.keys(data) : [],
  id: data?.id,
  title: data?.title,
  type: data?.type,
  nestedCreationKeys:
    data?.creation && typeof data.creation === "object"
      ? Object.keys(data.creation)
      : [],
});
  if (error) {
    return {
      data: null,
      error,
    };
  }

  if (!data) {
    return {
      data: null,
      error: null,
    };
  }

  const {
    data: attributionByOwnerId,
    error: attributionError,
  } = await getOwnerAttributionById({
    creationRepository,
    ownerIds: [data.owner_id],
  });

  if (attributionError) {
    return {
      data: null,
      error: attributionError,
    };
  }

  const attributedRow = applyOwnerAttribution(data, attributionByOwnerId);

  const {
    data: rowsWithFeaturedMedia,
    error: featuredMediaError,
  } = await attachFeaturedImageSlotsToCreationRows({
    creationRepository,
    rows: [attributedRow],
  });

  if (featuredMediaError) {
    return {
      data: null,
      error: featuredMediaError,
    };
  }

  return {
    data: toCreationEditPayload(rowsWithFeaturedMedia?.[0] || attributedRow),
    error: null,
  };
}