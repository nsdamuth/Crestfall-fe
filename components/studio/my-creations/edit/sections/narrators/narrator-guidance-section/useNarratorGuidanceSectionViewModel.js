const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Guidance",
  sectionDescription:
    "Edit the narrator's reusable runtime guidance, prose behavior, and habits to avoid.",
  guidanceLabel: "Narrator Guidance",
  guidancePlaceholder:
    "Guidance for prose style, scene framing, transitions, tension, and how much the narrator should intervene.",
  avoidGuidanceLabel: "Avoid Guidance",
  avoidGuidancePlaceholder: "Describe narration habits to avoid.",
});

export function getNarratorGuidanceSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    guidanceValue: data.narrator_guidance || "",
    avoidGuidanceValue: data.avoid_guidance || "",
    onChangeGuidance: (value) =>
      updateDataField?.("narrator_guidance", value),
    onChangeAvoidGuidance: (value) =>
      updateDataField?.("avoid_guidance", value),
  };
}

export function useNarratorGuidanceSectionViewModel(props = {}) {
  return getNarratorGuidanceSectionViewProps(props);
}
