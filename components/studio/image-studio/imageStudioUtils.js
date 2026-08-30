import {
  buildFeaturedMedia,
  getDefaultCreationImageForType,
  getFirstCreationMediaUrl,
} from "@/lib/shared/creations/creationMedia";

export function getImageStudioAllowedTypes(slots = []) {
  return [
    ...new Set(
      slots
        .flatMap((slot) => slot.allowedTypes || [])
        .filter(Boolean)
    ),
  ];
}

export function normalizeImageStudioIngredientOption(creation) {
  const featuredMedia = buildFeaturedMedia({
    row: creation,
    data: creation.data,
    title: creation.title,
    max: 1,
  });

  const fallbackImage = getDefaultCreationImageForType(creation.type);
  const thumbnailUrl = getFirstCreationMediaUrl(featuredMedia, {
    variant: "thumbnail",
    fallback: fallbackImage,
  });

  return {
    id: creation.id,
    type: creation.type,
    title:
      creation.title ||
      creation.data?.name ||
      creation.data?.title ||
      "Untitled Creation",
    subtitle:
      creation.description ||
      creation.data?.short_concept ||
      creation.data?.description ||
      "",
    description:
      creation.description ||
      creation.data?.short_concept ||
      creation.data?.description ||
      "",
    imageUrl: thumbnailUrl,
    thumbnailUrl,
    featuredMedia,
    contentRating: creation.contentRating || creation.content_rating || "SFW",
    visibility: creation.visibility || "PRIVATE",
    status: creation.status || "DRAFT",
    source: "MY_ASSET",
    rawCreation: creation,
  };
}

export function getImageStudioOptionsForSlot(creations = [], slot) {
  const allowedTypes = new Set(slot?.allowedTypes || []);

  return creations
    .filter((creation) => allowedTypes.has(creation.type))
    .map(normalizeImageStudioIngredientOption);
}