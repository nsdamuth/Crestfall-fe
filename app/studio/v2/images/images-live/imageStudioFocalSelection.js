import { resolveImageFocalObjectPosition } from "../../../../../lib/shared/media/imageFocalPresentation.js";

function getPrimaryIngredientMedia(value) {
  const featuredMedia = value?.featuredMedia || value?.featured_media || [];
  return Array.isArray(featuredMedia) ? featuredMedia[0] || null : null;
}

export function getIngredientSelectionImagePosition(slotId, value) {
  if (slotId !== "character" && slotId !== "playerCharacter") {
    return null;
  }

  return resolveImageFocalObjectPosition(getPrimaryIngredientMedia(value), {
    fallback: null,
    verticalFallback: 0.2,
  });
}
