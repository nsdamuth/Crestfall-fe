import {
  POSE_ENERGY_OPTIONS,
  POSE_VIEWER_RELATION_OPTIONS,
  normalizePoseSemantics,
} from "@/lib/shared/creations/poseSemantics";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Motion / Staging",
  sectionDescription:
    "Describe motion and contextual staging. Geometry remains authoritative; mood and viewer relation are soft defaults that can yield to the active scene or camera request.",
  actionMotionLabel: "Action / Motion",
  actionMotionHelper:
    "Useful to image generation and to chat pose matching for dynamic poses.",
  energyLevelLabel: "Energy Level",
  energyLevelHelper:
    "Soft style/energy modifier, not body-geometry authority.",
  viewerRelationLabel: "Viewer Relation",
  viewerRelationHelper:
    "Default subject-to-viewer relationship. Explicit camera/framing instructions override this.",
  propInteractionLabel: "Prop Interaction",
  propInteractionHelper:
    "Conditional staging only. This pose never creates a prop that is not otherwise present.",
  sceneFitLabel: "Scene Fit",
  sceneFitHelper:
    "Recommendation/search metadata; not inserted automatically into image prompts.",
  moodAttitudeLabel: "Mood / Attitude",
  moodAttitudeHelper:
    "Optional soft default. Current scene emotion or explicit user direction wins.",
  stagingNotesLabel: "Staging Notes",
  stagingNotesPlaceholder:
    "Contextual rules for space, support, props, clothing, framing, or scene fit. Keep body geometry in Body Position.",
});

export function getPoseMotionStagingSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const semantics = normalizePoseSemantics(form?.data || {});

  return {
    ...DEFAULT_COPY,
    actionMotionValue: semantics.action_motion,
    energyLevelValue: semantics.energy_level,
    energyOptions: POSE_ENERGY_OPTIONS,
    viewerRelationValue: semantics.viewer_relation,
    viewerRelationOptions: POSE_VIEWER_RELATION_OPTIONS,
    propInteractionValue: semantics.prop_interaction,
    sceneFitValue: semantics.scene_fit,
    moodAttitudeValue: semantics.mood_attitude,
    stagingNotesValue: semantics.staging_notes,
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
