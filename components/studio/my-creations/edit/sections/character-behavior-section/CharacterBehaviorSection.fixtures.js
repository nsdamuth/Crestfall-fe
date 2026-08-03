const verbosityOptions = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "1", label: "1 — Terse" },
  { value: "2", label: "2 — Concise" },
  { value: "3", label: "3 — Balanced" },
  { value: "4", label: "4 — Expressive" },
  { value: "5", label: "5 — Highly Verbose" },
]);

const baseFixture = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Behavior",
  sectionDescription:
    "Edit how this character speaks, moves, thinks, and expresses themselves using guided controls.",
  personalityFrameworksEyebrow: "Optional Personality Frameworks",
  personalityFrameworksDescription:
    "These provide soft narrative flavor and never override explicit personality choices or creator notes.",
  verbosityLabel: "Verbosity",
  verbosityOptions,
  verbosityDescription:
    "Controls how talkative the character should be during scenes.",
  philosophyLabel: "Philosophy",
  philosophyPlaceholder:
    "What does this character believe about the world, people, power, duty, freedom, love, fear, or survival?",
});

export const characterBehaviorSectionPopulatedFixture = {
  ...baseFixture,
  verbosityValue: "3",
  philosophyValue:
    "A promise creates a debt of meaning. Power is only worth holding when its cost is acknowledged.",
};

export const characterBehaviorSectionEmptyFixture = {
  ...baseFixture,
  verbosityValue: "",
  philosophyValue: "",
};

export const characterBehaviorSectionExpressiveFixture = {
  ...baseFixture,
  verbosityValue: "5",
  philosophyValue:
    "Curiosity is a moral duty, but understanding something does not grant ownership over it. Every tool, spell, institution, and relationship should be examined for the bargain hidden inside it.",
};

export const characterBehaviorSectionLongContentFixture = {
  ...baseFixture,
  verbosityValue: "4",
  philosophyValue:
    "This intentionally long philosophy verifies that the portable Behavior section remains readable when a creator provides a detailed worldview covering duty, autonomy, love, fear, survival, social obligation, political power, magical responsibility, the value of evidence, the limits of certainty, and the difference between understanding another person and claiming authority over their choices.",
};

export const characterBehaviorSectionMissingCallbacksFixture = {
  ...characterBehaviorSectionPopulatedFixture,
  onSelectVerbosity: null,
  onChangePhilosophy: null,
};
