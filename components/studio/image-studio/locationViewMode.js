export const LOCATION_VIEW_MODE_OPTIONS = Object.freeze([
  Object.freeze({ value: "INTERIOR", label: "Interior" }),
  Object.freeze({ value: "EXTERIOR", label: "Exterior" }),
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
  const hasInterior = Boolean(interiorPrompt || interiorNegativePrompt);
  const hasExterior = Boolean(exteriorPrompt || exteriorNegativePrompt);

  return {
    hasInterior,
    hasExterior,
    hasModeSpecificGuidance: hasInterior || hasExterior,
    showToggle: hasInterior && hasExterior,
    interiorPrompt,
    interiorNegativePrompt,
    exteriorPrompt,
    exteriorNegativePrompt,
  };
}

export function getDefaultLocationViewMode(item) {
  const availability = getLocationViewGuidanceAvailability(item);
  if (availability.hasInterior) return "INTERIOR";
  if (availability.hasExterior) return "EXTERIOR";
  return "AUTO";
}

export function normalizeLocationViewModeForItem(item, requestedMode) {
  const availability = getLocationViewGuidanceAvailability(item);
  const normalized = normalizeString(requestedMode).toUpperCase();

  if (normalized === "INTERIOR" && availability.hasInterior) {
    return "INTERIOR";
  }

  if (normalized === "EXTERIOR" && availability.hasExterior) {
    return "EXTERIOR";
  }

  return getDefaultLocationViewMode(item);
}

export function buildLocationViewControl(item, requestedMode) {
  if (!item || item.custom) return null;

  const availability = getLocationViewGuidanceAvailability(item);
  if (!availability.hasModeSpecificGuidance) return null;

  const value = normalizeLocationViewModeForItem(item, requestedMode);

  return {
    value,
    showToggle: availability.showToggle,
    label: "Location View",
    helperText: availability.showToggle
      ? "Choose whether this location renders from inside or outside."
      : value === "INTERIOR"
        ? "This location provides interior-specific image guidance."
        : "This location provides exterior-specific image guidance.",
    options: LOCATION_VIEW_MODE_OPTIONS.filter((option) =>
      option.value === "INTERIOR"
        ? availability.hasInterior
        : availability.hasExterior
    ),
  };
}
