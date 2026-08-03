import {
  createDefaultGeneratedProgressionProfile,
  createDefaultProgressionProfile,
} from "./ProgressionProfileEditor.contract";

export const progressionProfileEditorFixture = Object.freeze({
  value: createDefaultProgressionProfile(),
});

export const generatedProgressionProfileEditorFixture = Object.freeze({
  value: createDefaultGeneratedProgressionProfile(),
});
