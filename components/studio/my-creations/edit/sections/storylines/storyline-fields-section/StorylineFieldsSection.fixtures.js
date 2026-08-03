const baseFixture = {
  editorSlot: null,
};

export const storylineFieldsSequenceFixture = {
  ...baseFixture,
  activeSection: "sequence",
  sectionEyebrow: "Sequence",
  sectionTitle: "Ordered Stories and Scenarios",
  sectionDescription:
    "Add saved Stories or Scenarios, place them in authored order, and keep the same chat continuous across the sequence.",
};

export const storylineFieldsTransitionsFixture = {
  ...baseFixture,
  activeSection: "transitions",
  sectionEyebrow: "Transitions",
  sectionTitle: "Node Completion and Activation",
  sectionDescription:
    "Configure how each node ends, whether play returns to open world, and what makes the following node available.",
};

export const storylineFieldsOpenWorldFixture = {
  ...baseFixture,
  activeSection: "openWorld",
  sectionEyebrow: "Continuity",
  sectionTitle: "Open-World Interludes",
  sectionDescription:
    "Control what remains active after a Story or Scenario ends and before the next Storyline node becomes eligible.",
};
