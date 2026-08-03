const baseSteps = [
  {
    id: "you",
    label: "1. You",
    title: "Starting State",
    helper:
      "Who begins in a familiar situation? What is normal before the scenario changes?",
    value:
      "The player arrives at an ordinary late-night archive shift while the city settles into rain.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "need",
    label: "2. Need",
    title: "Need / Want",
    helper:
      "What is missing, threatened, desired, unresolved, or emotionally necessary?",
    value:
      "A sealed case file has vanished, and the archivist needs to recover it before morning review.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "go",
    label: "3. Go",
    title: "Crossing Point",
    helper:
      "What pulls the player or cast into unfamiliar pressure, danger, mystery, or opportunity?",
    value:
      "A service elevator opens onto a floor that does not exist on the building plan.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "search",
    label: "4. Search",
    title: "Complications",
    helper:
      "What trials, investigations, choices, obstacles, or social pressures shape the middle?",
    value:
      "Contradictory witnesses, duplicate timestamps, and an internal lockdown complicate the search.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "find",
    label: "5. Find",
    title: "Discovery",
    helper:
      "What is found, revealed, achieved, or misunderstood as apparent success?",
    value:
      "The missing file is found inside a room that appears to remember a different investigation.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "take",
    label: "6. Take",
    title: "Cost",
    helper:
      "What price, consequence, sacrifice, danger, or emotional cost follows?",
    value:
      "Recovering the file exposes a witness and forces the player to choose which record survives.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "return",
    label: "7. Return",
    title: "Resolution Path",
    helper:
      "How does the story return toward safety, home, clarity, or a changed situation?",
    value:
      "The elevator returns to the archive moments before morning staff arrive.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
  {
    id: "change",
    label: "8. Change",
    title: "Meaningful Change",
    helper:
      "What changes because this scenario happened? What lesson, state, unlock, or relationship shift remains?",
    value:
      "The player now knows the building contains impossible case spaces and has earned cautious OIP attention.",
    placeholder: "Optional story-circle notes...",
    onChange: null,
  },
];

const baseFixture = {
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Story Circle",
  sectionDescription:
    "Edit the scenario structure from hook to consequence to meaningful change.",
  steps: baseSteps,
};

export const scenarioStoryCircleCompleteFixture = {
  ...baseFixture,
};

export const scenarioStoryCircleEmptyFixture = {
  ...baseFixture,
  steps: baseSteps.map((step) => ({ ...step, value: "" })),
};

export const scenarioStoryCirclePartialFixture = {
  ...baseFixture,
  steps: baseSteps.map((step, index) => ({
    ...step,
    value: index < 3 ? step.value : "",
  })),
};

export const scenarioStoryCircleLongContentFixture = {
  ...baseFixture,
  steps: baseSteps.map((step) => ({
    ...step,
    value: `${step.value} The note continues with additional context about competing character goals, environmental pressure, unresolved evidence, and alternate paths that should remain available without forcing a single outcome.`,
  })),
};

export const scenarioStoryCircleMissingCallbacksFixture = {
  ...baseFixture,
  steps: baseSteps.map((step) => ({ ...step, onChange: null })),
};

export const scenarioStoryCircleCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Scenario Structure",
  sectionTitle: "Narrative Progression",
  sectionDescription:
    "Preview alternate display copy without changing the semantic Story Circle contract.",
};
