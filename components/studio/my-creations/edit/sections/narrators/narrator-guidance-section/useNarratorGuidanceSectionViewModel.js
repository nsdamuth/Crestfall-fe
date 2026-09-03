import {
  NARRATOR_PRESENTATION_PRIORITY_OPTIONS,
  normalizePriorityOrder,
} from "@/components/studio/my-creations/edit/priority-triads/priorityTriadEditorContract";

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
  presentationPrioritiesTitle: "Presentation & Pressure Priorities",
  presentationPrioritiesDescription:
    "Optional 1→2→3 preference order for presentation and low-authority story-pressure reasoning: what valid pressure to foreground, when to emphasize it, and how to frame it.",
  presentationPrioritiesAuthorityNote:
    "Preference only. Story state, continuity, mechanics, knowledge, and actor authority are resolved first. These priorities cannot establish facts, mutate state, move or control actors, create history, or advance Story/Continuity by themselves.",
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
    narratorDirectivesValue: data.narrator_directives || null,
    presentationPriorityOptions: NARRATOR_PRESENTATION_PRIORITY_OPTIONS,
    presentationPrioritiesValue: normalizePriorityOrder(
      data.presentationPriorities,
      NARRATOR_PRESENTATION_PRIORITY_OPTIONS
    ),
    onChangeGuidance: (value) =>
      updateDataField?.("narrator_guidance", value),
    onChangeAvoidGuidance: (value) =>
      updateDataField?.("avoid_guidance", value),
    onChangeNarratorDirectives: (value) =>
      updateDataField?.("narrator_directives", value),
    onChangePresentationPriorities: (value) =>
      updateDataField?.("presentationPriorities", value),
  };
}

export function useNarratorGuidanceSectionViewModel(props = {}) {
  return getNarratorGuidanceSectionViewProps(props);
}
