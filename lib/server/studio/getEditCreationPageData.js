import { notFound } from "next/navigation";

import {
  feApiRequest,
} from "@/lib/server/api/feApiRequest";

const FEATURED_SLOT_ORDER = [
  "primary",
  "alt1",
  "alt2",
  "alt3",
];

const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

function normalizeObject(value) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function getServiceErrorCode(error) {
  return (
    error?.payload?.error?.code ||
    error?.payload?.code ||
    null
  );
}

function getServiceErrorMessage(error) {
  return (
    error?.payload?.error?.message ||
    error?.payload?.error ||
    error?.message ||
    "Creation could not be loaded."
  );
}

function getCreationFromPayload(payload) {
  return (
    payload?.data?.creation ||
    payload?.creation ||
    null
  );
}

function getImageLibraryFromPayload(
  payload
) {
  /*
   * Supports both response contracts:
   *
   * Older:
   * {
   *   data: {
   *     imageLibrary: {
   *       images,
   *       featuredSlots
   *     }
   *   }
   * }
   *
   * Current:
   * {
   *   data: {
   *     creation,
   *     images,
   *     featuredSlots
   *   }
   * }
   */
  const imageLibrary =
    payload?.data?.imageLibrary ||
    payload?.imageLibrary ||
    payload?.data ||
    null;

  if (
    !imageLibrary ||
    typeof imageLibrary !== "object" ||
    Array.isArray(imageLibrary)
  ) {
    return null;
  }

  return imageLibrary;
}

function getImageDisplayUrl(image) {
  return (
    normalizeString(
      image?.displayImageUrl
    ) ||
    normalizeString(
      image?.displayUrl
    ) ||
    normalizeString(
      image?.thumbnailUrl
    ) ||
    normalizeString(
      image?.imageUrl
    ) ||
    normalizeString(
      image?.url
    ) ||
    normalizeString(
      image?.originalUrl
    ) ||
    null
  );
}

function getImageOriginalUrl(image) {
  return (
    normalizeString(
      image?.originalUrl
    ) ||
    normalizeString(
      image?.assetUrl
    ) ||
    normalizeString(
      image?.displayUrl
    ) ||
    normalizeString(
      image?.imageUrl
    ) ||
    normalizeString(
      image?.url
    ) ||
    null
  );
}

function buildEditFeaturedMedia({
  creation,
  imageLibrary,
}) {
  const featuredSlots =
    normalizeObject(
      imageLibrary?.featuredSlots ||
        imageLibrary?.featured_slots
    );

  return FEATURED_SLOT_ORDER.map(
    (slotKey, index) => {
      const slot = normalizeObject(
        featuredSlots[slotKey]
      );

      const image = normalizeObject(
        slot.image
      );

      const imageUrl =
        getImageDisplayUrl(image);

      const originalUrl =
        getImageOriginalUrl(image);

      const libraryEntryId =
        slot.libraryEntryId ||
        slot.library_entry_id ||
        image.id ||
        image.libraryEntryId ||
        image.library_entry_id ||
        null;

      const imageOutputId =
        image.imageOutputId ||
        image.image_output_id ||
        null;

      return {
        id:
          libraryEntryId ||
          `slot-${index + 1}`,

        slotKey,

        label:
          slot.label ||
          FEATURED_SLOT_LABELS[
            slotKey
          ],

        title:
          image.title ||
          creation.title ||
          FEATURED_SLOT_LABELS[
            slotKey
          ],

        /*
         * CreationEditMediaPanel reads
         * this field for both the active
         * image and the four thumbnails.
         */
        imageUrl,

        url: imageUrl,

        displayUrl:
          image.displayUrl ||
          imageUrl,

        thumbnailUrl:
          image.thumbnailUrl ||
          imageUrl,

        originalUrl,

        assetUrl:
          originalUrl ||
          imageUrl,

        libraryEntryId,
        imageOutputId,

        storagePath:
          image.storagePath ||
          image.storage_path ||
          null,

        storageProvider:
          image.storageProvider ||
          image.storage_provider ||
          null,

        contentRating:
          image.contentRating ||
          image.content_rating ||
          creation.contentRating ||
          creation.content_rating ||
          "SFW",

        moderationStatus:
          image.moderationStatus ||
          image.moderation_status ||
          null,

        isPlaceholder: false,
      };
    }
  );
}

export async function getEditCreationPageData(
  id
) {
  const creationId =
    typeof id === "string"
      ? id.trim()
      : "";

  if (!creationId) {
    notFound();
  }

  const encodedCreationId =
    encodeURIComponent(creationId);

  let creationPayload;
  let imageLibraryPayload;

  try {
    [
      creationPayload,
      imageLibraryPayload,
    ] = await Promise.all([
      feApiRequest({
        path:
          `/api/creations/${encodedCreationId}`,
      }),

      feApiRequest({
        path:
          `/api/creations/${encodedCreationId}/image-library`,
      }),
    ]);
  } catch (error) {
    const errorCode =
      getServiceErrorCode(error);

    if (
      error?.status === 401 ||
      error?.status === 404 ||
      errorCode === "UNAUTHORIZED" ||
      errorCode ===
        "CREATION_NOT_FOUND"
    ) {
      notFound();
    }

    throw new Error(
      getServiceErrorMessage(error)
    );
  }

  const creation =
    getCreationFromPayload(
      creationPayload
    );

  if (!creation) {
    notFound();
  }

  const imageLibrary =
    getImageLibraryFromPayload(
      imageLibraryPayload
    );

  if (!imageLibrary) {
    throw new Error(
      "Creation image library could not be loaded."
    );
  }

  const featuredMedia =
    buildEditFeaturedMedia({
      creation,
      imageLibrary,
    });

  const primaryImageUrl =
    featuredMedia[0]?.imageUrl ||
    creation.imageUrl ||
    null;

  return {
    creation: {
      ...creation,

      /*
       * These top-level fields satisfy
       * the existing edit ViewModel and
       * CreationEditMediaPanel contract.
       *
       * Do not add these proxy URLs into
       * creation.data during hydration.
       */
      imageUrl: primaryImageUrl,
      featuredMedia,
      featured_media:
        featuredMedia,
    },
  };
}