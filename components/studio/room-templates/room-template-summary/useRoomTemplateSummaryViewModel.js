function normalizeSelectionTitle(selection, fallback) {
  return selection?.title || fallback;
}

export function useRoomTemplateSummaryViewModel({
  selectedCharacters = [],
  selectedScenario = null,
  selectedNarrator = null,
  selectedLocation = null,
} = {}) {
  const characterCount = Array.isArray(selectedCharacters)
    ? selectedCharacters.length
    : 0;

  return {
    eyebrow: "Story",
    summaryRows: [
      {
        id: "characters",
        label: "Characters",
        value: characterCount || "None selected",
      },
      {
        id: "scenario",
        label: "Scenario",
        value: normalizeSelectionTitle(selectedScenario, "Not selected"),
      },
      {
        id: "narrator",
        label: "Narrator",
        value: normalizeSelectionTitle(selectedNarrator, "Not selected"),
      },
      {
        id: "location",
        label: "Location",
        value: normalizeSelectionTitle(selectedLocation, "Optional"),
      },
    ],
  };
}
