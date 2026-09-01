const baseFixture = {
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Guidance",
  sectionDescription:
    "Edit the narrator's reusable runtime guidance, prose behavior, and habits to avoid.",
  guidanceLabel: "Narrator Guidance",
  guidanceValue:
    "Frame each scene cinematically, establish the immediate sensory environment, and let tension build through character choices rather than exposition.",
  guidancePlaceholder:
    "Guidance for prose style, scene framing, transitions, tension, and how much the narrator should intervene.",
  avoidGuidanceLabel: "Avoid Guidance",
  avoidGuidanceValue:
    "Avoid summarizing emotional reactions before characters have a chance to demonstrate them through dialogue or action.",
  avoidGuidancePlaceholder: "Describe narration habits to avoid.",
  narratorDirectivesControl: null,
  onChangeGuidance: null,
  onChangeAvoidGuidance: null,
};

export const narratorGuidanceSectionDefaultFixture = {
  ...baseFixture,
};

export const narratorGuidanceSectionEmptyFixture = {
  ...baseFixture,
  guidanceValue: "",
  avoidGuidanceValue: "",
};

export const narratorGuidanceSectionGuidanceOnlyFixture = {
  ...baseFixture,
  avoidGuidanceValue: "",
};

export const narratorGuidanceSectionAvoidOnlyFixture = {
  ...baseFixture,
  guidanceValue: "",
};

export const narratorGuidanceSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Narrator Guidance for a Long-Form Multi-Realm Chronicle",
  sectionDescription:
    "Edit reusable runtime guidance for a narrator responsible for a large ensemble, several regions, overlapping timelines, political consequences, mysteries, and long-running character arcs while preserving a coherent prose identity.",
  guidanceValue:
    "Open scenes by grounding the reader in location, time, atmosphere, and immediate social tension. Preserve continuity across prior scenes without repeating information the active characters already understand. Use sensory detail selectively, emphasize physical reactions when they reveal motive, and allow dialogue to carry conflict whenever possible. During ensemble scenes, distribute attention according to relevance rather than rotating mechanically between every participant.",
  avoidGuidanceValue:
    "Do not decide player-character intentions, resolve major conflicts without interaction, repeat the same environmental details in consecutive turns, overuse sentence fragments, or describe every silence as heavy, charged, or pregnant with meaning.",
};

export const narratorGuidanceSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Runtime Voice",
  sectionTitle: "Guidance and Guardrails",
  sectionDescription:
    "Review the positive direction and prohibited habits supplied to the narrator.",
  guidanceLabel: "Preferred Behavior",
  avoidGuidanceLabel: "Prohibited Behavior",
};

export const narratorGuidanceSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeGuidance: null,
  onChangeAvoidGuidance: null,
};
