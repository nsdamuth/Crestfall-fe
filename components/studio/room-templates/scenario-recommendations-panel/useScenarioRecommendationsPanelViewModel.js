function normalizeRecommendationTitles(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => String(item?.title || ""));
}

function normalizeRecommendationTitle(item) {
  return String(item?.title || "");
}

export function useScenarioRecommendationsPanelViewModel({
  recommendations = {},
  onApplyAll,
  onApplyRequired,
  onApplyOptional,
  onApplyLocation,
  onApplyNarrator,
  onApplyNpcRegistries,
  onSkip,
} = {}) {
  const safeRecommendations =
    recommendations && typeof recommendations === "object"
      ? recommendations
      : {};

  const requiredCharacters = Array.isArray(
    safeRecommendations.requiredCharacters
  )
    ? safeRecommendations.requiredCharacters
    : [];
  const optionalCharacters = Array.isArray(
    safeRecommendations.optionalCharacters
  )
    ? safeRecommendations.optionalCharacters
    : [];
  const suggestedNpcRegistries = Array.isArray(
    safeRecommendations.suggestedNpcRegistries
  )
    ? safeRecommendations.suggestedNpcRegistries
    : [];

  return {
    requiredCharacterTitles: normalizeRecommendationTitles(requiredCharacters),
    optionalCharacterTitles: normalizeRecommendationTitles(optionalCharacters),
    suggestedLocationTitle: normalizeRecommendationTitle(
      safeRecommendations.suggestedLocation
    ),
    suggestedNarratorTitle: normalizeRecommendationTitle(
      safeRecommendations.suggestedNarrator
    ),
    suggestedNpcRegistryTitles: normalizeRecommendationTitles(
      suggestedNpcRegistries
    ),
    canApplyRequiredCharacters: requiredCharacters.length > 0,
    canApplyOptionalCharacters: optionalCharacters.length > 0,
    canApplySuggestedLocation: Boolean(
      safeRecommendations.suggestedLocation?.id
    ),
    canApplySuggestedNarrator: Boolean(
      safeRecommendations.suggestedNarrator?.id
    ),
    canApplySuggestedNpcRegistries: suggestedNpcRegistries.length > 0,
    onApplyAll,
    onApplyRequiredCharacters: onApplyRequired,
    onApplyOptionalCharacters: onApplyOptional,
    onApplySuggestedLocation: onApplyLocation,
    onApplySuggestedNarrator: onApplyNarrator,
    onApplySuggestedNpcRegistries: onApplyNpcRegistries,
    onSkipRecommendations: onSkip,
  };
}
