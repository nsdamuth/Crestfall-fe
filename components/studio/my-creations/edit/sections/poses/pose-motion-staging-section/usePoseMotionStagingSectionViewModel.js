const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Motion / Staging",
  sectionDescription:
    "Define action energy, staging, prop interaction, viewer relation, and how this pose should feel in generated images.",
  actionMotionLabel: "Action / Motion",
  energyLevelLabel: "Energy Level",
  viewerRelationLabel: "Viewer Relation",
  propInteractionLabel: "Prop Interaction",
  sceneFitLabel: "Scene Fit",
  moodAttitudeLabel: "Mood / Attitude",
  stagingNotesLabel: "Staging Notes",
  stagingNotesPlaceholder:
    "Describe how the pose should be staged in relation to space, props, clothing, action, expression, and scene mood.",
});

export function getPoseMotionStagingSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    actionMotionValue: data.action_motion || "",
    energyLevelValue: data.energy_level || "",
    viewerRelationValue: data.viewer_relation || "",
    propInteractionValue: data.prop_interaction || "",
    sceneFitValue: data.scene_fit || "",
    moodAttitudeValue: data.mood_attitude || "",
    stagingNotesValue: data.staging_notes || "",
    onChangeActionMotion: (value) =>
      updateDataField?.("action_motion", value),
    onChangeEnergyLevel: (value) =>
      updateDataField?.("energy_level", value),
    onChangeViewerRelation: (value) =>
      updateDataField?.("viewer_relation", value),
    onChangePropInteraction: (value) =>
      updateDataField?.("prop_interaction", value),
    onChangeSceneFit: (value) => updateDataField?.("scene_fit", value),
    onChangeMoodAttitude: (value) =>
      updateDataField?.("mood_attitude", value),
    onChangeStagingNotes: (value) =>
      updateDataField?.("staging_notes", value),
  };
}

export function usePoseMotionStagingSectionViewModel(props = {}) {
  return getPoseMotionStagingSectionViewProps(props);
}
