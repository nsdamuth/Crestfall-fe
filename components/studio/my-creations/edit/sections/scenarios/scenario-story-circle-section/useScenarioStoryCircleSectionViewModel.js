const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Story Circle",
  sectionDescription:
    "Edit the scenario structure from hook to consequence to meaningful change.",
});

export const SCENARIO_STORY_CIRCLE_STEP_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "you",
    label: "1. You",
    title: "Starting State",
    helper:
      "Who begins in a familiar situation? What is normal before the scenario changes?",
  }),
  Object.freeze({
    id: "need",
    label: "2. Need",
    title: "Need / Want",
    helper:
      "What is missing, threatened, desired, unresolved, or emotionally necessary?",
  }),
  Object.freeze({
    id: "go",
    label: "3. Go",
    title: "Crossing Point",
    helper:
      "What pulls the player or cast into unfamiliar pressure, danger, mystery, or opportunity?",
  }),
  Object.freeze({
    id: "search",
    label: "4. Search",
    title: "Complications",
    helper:
      "What trials, investigations, choices, obstacles, or social pressures shape the middle?",
  }),
  Object.freeze({
    id: "find",
    label: "5. Find",
    title: "Discovery",
    helper:
      "What is found, revealed, achieved, or misunderstood as apparent success?",
  }),
  Object.freeze({
    id: "take",
    label: "6. Take",
    title: "Cost",
    helper:
      "What price, consequence, sacrifice, danger, or emotional cost follows?",
  }),
  Object.freeze({
    id: "return",
    label: "7. Return",
    title: "Resolution Path",
    helper:
      "How does the story return toward safety, home, clarity, or a changed situation?",
  }),
  Object.freeze({
    id: "change",
    label: "8. Change",
    title: "Meaningful Change",
    helper:
      "What changes because this scenario happened? What lesson, state, unlock, or relationship shift remains?",
  }),
]);

export function normalizeScenarioStoryCircle(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

export function getScenarioStoryCircleSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const storyCircle = normalizeScenarioStoryCircle(form?.data?.story_circle);

  return {
    ...DEFAULT_COPY,
    steps: SCENARIO_STORY_CIRCLE_STEP_DEFINITIONS.map((step) => ({
      ...step,
      value: storyCircle[step.id] || "",
      placeholder: "Optional story-circle notes...",
      onChange: (value) =>
        updateDataField?.("story_circle", {
          ...storyCircle,
          [step.id]: value,
        }),
    })),
  };
}

export function useScenarioStoryCircleSectionViewModel(props = {}) {
  return getScenarioStoryCircleSectionViewProps(props);
}
