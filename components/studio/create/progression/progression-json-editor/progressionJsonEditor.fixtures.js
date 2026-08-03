import { createDefaultGeneratedProgressionProfile } from "../progression-profile-editor/ProgressionProfileEditor.contract";

export const progressionJsonEditorFixture = Object.freeze({
  progressionProfile: createDefaultGeneratedProgressionProfile(),
  onApply: () => {},
  onClose: () => {},
});
