import { createDefaultProgressionProfile } from "../progression-profile-editor/ProgressionProfileEditor.contract";

export const progressionProfileBuilderFixture = Object.freeze({
  title: "Adventurer Progression",
  description: "A reusable deterministic progression profile.",
  visibility: "PRIVATE",
  contentRating: "SFW",
  progressionProfile: createDefaultProgressionProfile(),
});
