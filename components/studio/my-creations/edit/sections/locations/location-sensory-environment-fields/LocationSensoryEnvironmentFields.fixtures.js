const sharedCopy = {
  guidanceText:
    "These 1–10 values are qualitative narrative guidance, not physical measurements. Leave a field blank to inherit the nearest authored parent value or use the runtime default when no parent value exists.",
  scaleMin: 1,
  scaleMax: 10,
  visionEyebrow: "Vision",
  visionTitle: "Light and Visibility",
  visionDescription:
    "Describe how much usable light and visual interference normally exist here. Temporary weather, spells, devices, and scene actions can modify these values later.",
  hearingEyebrow: "Hearing",
  hearingTitle: "Sound Environment",
  hearingDescription:
    "Describe the normal sound pressure of the scene and how difficult it is to locate or interpret sounds within it.",
  scentEyebrow: "Scent",
  scentTitle: "Ambient Scent Palette",
  scentDescription:
    "Define the location's normal scent notes and how strongly the environment masks or disperses other scents. Parent and local scent notes can accumulate.",
  emptyScentNotesText:
    "No local scent notes are authored. The location may still inherit scent notes from its parent hierarchy.",
  addScentNoteLabel: "Add Scent Note",
};

export const locationSensoryEnvironmentCompleteFixture = Object.freeze({
  ...sharedCopy,
  visionLightLevelValue: 6,
  visionObstructionLevelValue: 3,
  visionGlareLevelValue: 2,
  hearingAmbientNoiseLevelValue: 5,
  hearingObstructionLevelValue: 4,
  hearingEchoLevelValue: 2,
  scentMaskingLevelValue: 7,
  scentDispersalLevelValue: 4,
  scentNotes: [
    {
      loomViewId: "scent-note-0",
      loomRowIndex: 0,
      label: "Warm brass and machine oil",
      strength: 7,
      tags: ["industrial", "workshop"],
      tagDraft: "",
      canAddTags: false,
    },
    {
      loomViewId: "scent-note-1",
      loomRowIndex: 1,
      label: "Rain-wet stone",
      strength: 4,
      tags: ["weather", "street"],
      tagDraft: "",
      canAddTags: false,
    },
  ],
});

export const locationSensoryEnvironmentInheritedFixture = Object.freeze({
  ...sharedCopy,
  visionLightLevelValue: null,
  visionObstructionLevelValue: null,
  visionGlareLevelValue: null,
  hearingAmbientNoiseLevelValue: null,
  hearingObstructionLevelValue: null,
  hearingEchoLevelValue: null,
  scentMaskingLevelValue: null,
  scentDispersalLevelValue: null,
  scentNotes: [],
});

export const locationSensoryEnvironmentSparseFixture = Object.freeze({
  ...sharedCopy,
  visionLightLevelValue: 2,
  visionObstructionLevelValue: 8,
  visionGlareLevelValue: null,
  hearingAmbientNoiseLevelValue: 1,
  hearingObstructionLevelValue: null,
  hearingEchoLevelValue: 9,
  scentMaskingLevelValue: null,
  scentDispersalLevelValue: 8,
  scentNotes: [
    {
      loomViewId: "scent-note-0",
      loomRowIndex: 0,
      label: "Cold mineral air",
      strength: 5,
      tags: [],
      tagDraft: "cavern, damp",
      canAddTags: true,
    },
  ],
});
