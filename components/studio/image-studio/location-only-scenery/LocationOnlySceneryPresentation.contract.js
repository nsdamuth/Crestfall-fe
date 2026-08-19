export const LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION =
  "location_only_scenery.presentation.v1";

export const LOCATION_ONLY_SCENERY_CALLBACK_KEYS = Object.freeze([
  "onChangeEnabled",
]);

function hasIngredient(value) {
  return Boolean(
    value &&
      (typeof value !== "object" ||
        value.id ||
        value.creationId ||
        value.custom ||
        value.title ||
        value.name)
  );
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getIngredientLabel(value) {
  if (!value || typeof value !== "object") return "";

  return (
    text(value.title) ||
    text(value.name) ||
    text(value.label) ||
    text(value.displayName) ||
    text(value.customText) ||
    ""
  );
}

export function isLocationOnlySceneryComposition(
  selectedIngredients = {}
) {
  return Boolean(
    hasIngredient(selectedIngredients.location) &&
      !hasIngredient(selectedIngredients.character) &&
      !hasIngredient(selectedIngredients.playerCharacter)
  );
}

export function projectLocationOnlySceneryPresentation({
  mode = "IMAGE",
  selectedIngredients = {},
  enabled = true,
} = {}) {
  const imageMode = String(mode || "IMAGE").toUpperCase() === "IMAGE";
  const locationOnly = isLocationOnlySceneryComposition(selectedIngredients);
  const visible = imageMode && locationOnly;
  const locationLabel = getIngredientLabel(selectedIngredients.location);

  return {
    contractVersion: LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
    visible,
    enabled: Boolean(enabled),
    eligible: locationOnly,
    mode: imageMode ? "IMAGE" : "VIDEO",
    title: "Optimize for scenery-only image",
    description:
      "Adds scenic composition guidance and suppresses people.",
    locationLabel,
    helperStateLabel: Boolean(enabled) ? "On" : "Off",
    disabled: !visible,
  };
}
