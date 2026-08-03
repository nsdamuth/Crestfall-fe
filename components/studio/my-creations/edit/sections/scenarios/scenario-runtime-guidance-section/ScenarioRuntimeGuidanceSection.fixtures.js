const baseFixture = {
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Opening Scene and Runtime Guidance",
  sectionDescription:
    "Edit opening setup, hidden runtime notes, drift fixes, and failure handling.",
  openingScene:
    "The market bells ring thirteen times as the last bridge lantern goes dark.",
  openingMessages:
    "Narrator: A brass compass begins pointing toward a street that does not exist.",
  privateRuntimeGuidance:
    "Keep the first scene focused on investigation and sensory grounding. Do not reveal the source of the anomaly immediately.",
  driftFixes:
    "Return attention to the impossible compass, the missing street, or a witness whose account conflicts with the map.",
  failureHandling:
    "Failed attempts should expose a new contradiction, cost time, or close one route while opening another.",
  onOpeningSceneChange: null,
  onOpeningMessagesChange: null,
  onPrivateRuntimeGuidanceChange: null,
  onDriftFixesChange: null,
  onFailureHandlingChange: null,
};

export const scenarioRuntimeGuidancePopulatedFixture = {
  ...baseFixture,
};

export const scenarioRuntimeGuidanceEmptyFixture = {
  ...baseFixture,
  openingScene: "",
  openingMessages: "",
  privateRuntimeGuidance: "",
  driftFixes: "",
  failureHandling: "",
};

export const scenarioRuntimeGuidanceLongCopyFixture = {
  ...baseFixture,
  privateRuntimeGuidance:
    "Keep the opening grounded in ordinary movement through the environment before allowing the irregular details to accumulate. Characters should notice different evidence based on their knowledge and position, and no single witness should provide a complete explanation. Preserve player agency, allow investigation to fail forward, and keep the hidden cause unresolved until the scenario has earned a stronger reveal through several connected observations.",
  failureHandling:
    "When a plan fails, preserve the consequences rather than resetting the scene. The failed approach may consume time, attract institutional attention, damage trust, or make one source of evidence unavailable, but it should also leave a new clue, a changed relationship, or a different route toward the scenario's central pressure.",
};

export const scenarioRuntimeGuidanceMissingCallbacksFixture = {
  ...baseFixture,
};
