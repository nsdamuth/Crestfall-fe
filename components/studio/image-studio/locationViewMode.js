import {
  getLocationCustomViewIdFromMode,
  normalizeLocationCustomImageViews,
  toLocationCustomViewMode,
} from "../../../lib/shared/image-generation/locationImageViews.js";

export const LOCATION_VIEW_MODE_OPTIONS = Object.freeze([
  Object.freeze({ value: "AUTO", label: "Auto" }),
  Object.freeze({ value: "INTERIOR", label: "Interior" }),
  Object.freeze({ value: "EXTERIOR", label: "Exterior" }),
  Object.freeze({ value: "SCENIC", label: "Scenic" }),
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function getLocationAssetData(item) {
  return normalizeObject(item?.rawCreation?.data || item?.data);
}

export function getLocationViewGuidanceAvailability(item) {
  const data = getLocationAssetData(item);
  const interiorPrompt = normalizeString(
    data.interior_image_prompt || data.interiorImagePrompt
  );
  const interiorNegativePrompt = normalizeString(
    data.interior_negative_prompt || data.interiorNegativePrompt
  );
  const exteriorPrompt = normalizeString(
    data.exterior_image_prompt || data.exteriorImagePrompt
  );
  const exteriorNegativePrompt = normalizeString(
    data.exterior_negative_prompt || data.exteriorNegativePrompt
  );
  const scenicPrompt = normalizeString(
    data.scenic_image_prompt || data.scenicImagePrompt
  );
  const scenicNegativePrompt = normalizeString(
    data.scenic_negative_prompt || data.scenicNegativePrompt
  );
  const hasInterior = Boolean(interiorPrompt || interiorNegativePrompt);
  const hasExterior = Boolean(exteriorPrompt || exteriorNegativePrompt);
  const hasScenic = Boolean(scenicPrompt || scenicNegativePrompt);
  const availableModes = [
    hasInterior ? "INTERIOR" : null,
    hasExterior ? "EXTERIOR" : null,
    hasScenic ? "SCENIC" : null,
  ].filter(Boolean);
  const customViews = normalizeLocationCustomImageViews(
    data.custom_image_views || data.customImageViews
  );

  return {
    hasInterior,
    hasExterior,
    hasScenic,
    hasModeSpecificGuidance: availableModes.length > 0,
    showToggle: availableModes.length > 1,
    availableModes,
    interiorPrompt,
    interiorNegativePrompt,
    exteriorPrompt,
    exteriorNegativePrompt,
    scenicPrompt,
    scenicNegativePrompt,
    customViews,
  };
}

export function getDefaultLocationViewMode(_item) {
  return "AUTO";
}

export function normalizeLocationViewModeForItem(item, requestedMode) {
  if (!item || item.custom) return "AUTO";

  const raw = normalizeString(requestedMode);
  const normalized = raw.toUpperCase();
  if (LOCATION_VIEW_MODE_OPTIONS.some((option) => option.value === normalized)) {
    return normalized;
  }

  const customId = getLocationCustomViewIdFromMode(raw);
  if (
    customId &&
    getLocationViewGuidanceAvailability(item).customViews.some(
      (entry) => entry.id === customId
    )
  ) {
    return toLocationCustomViewMode(customId);
  }

  return getDefaultLocationViewMode(item);
}

export function buildLocationViewControl(item, requestedMode) {
  if (!item || item.custom) return null;

  const availability = getLocationViewGuidanceAvailability(item);
  const value = normalizeLocationViewModeForItem(item, requestedMode);

  return {
    value,
    showToggle: true,
    label: "Location View",
    helperText:
      "Choose which Location prompt to use for this image. Auto uses shared Location guidance; an empty selected view also falls back to shared guidance.",
    options: LOCATION_VIEW_MODE_OPTIONS,
    customOptions: availability.customViews.map((entry) => ({
      value: toLocationCustomViewMode(entry.id),
      label: entry.label,
    })),
    availability,
  };
}
