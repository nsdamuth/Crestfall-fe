import {
  POSE_BODY_ORIENTATION_OPTIONS,
  POSE_POSTURE_OPTIONS,
  normalizePoseSemantics,
} from "@/lib/shared/creations/poseSemantics";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Body Position",
  sectionDescription:
    "Define the pose geometry. Posture and orientation are normalized for reuse; limb and balance fields provide precise image-generation guidance.",
  postureLabel: "Posture",
  postureHelper:
    "Controlled continuity vocabulary used by chat and pose matching.",
  bodyOrientationLabel: "Body Orientation",
  bodyOrientationHelper:
    "Body facing direction. Viewer/camera relationship is configured separately under Motion / Staging.",
  armHandPositionLabel: "Arm / Hand Position",
  legFootPositionLabel: "Leg / Foot Position",
  facialExpressionLabel: "Facial Expression",
  facialExpressionHelper:
    "Optional soft default only. Scene emotion or an explicit image request should override it.",
  balanceWeightLabel: "Balance / Weight",
  bodyPositionNotesLabel: "Body Position Notes",
  bodyPositionNotesPlaceholder:
    "Describe exact pose details: torso, head, joints, limb spacing, support, and gaze where useful.",
});

export function getPoseBodyPositionSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const semantics = normalizePoseSemantics(form?.data || {});

  return {
    ...DEFAULT_COPY,
    postureValue: semantics.posture,
    postureOptions: POSE_POSTURE_OPTIONS,
    bodyOrientationValue: semantics.body_orientation,
    bodyOrientationOptions: POSE_BODY_ORIENTATION_OPTIONS,
    armHandPositionValue: semantics.arm_hand_position,
    legFootPositionValue: semantics.leg_foot_position,
    facialExpressionValue: semantics.facial_expression,
    balanceWeightValue: semantics.balance_weight,
    bodyPositionNotesValue: semantics.body_position_notes,
    onChangePosture: (value) => updateDataField?.("posture", value),
    onChangeBodyOrientation: (value) =>
      updateDataField?.("body_orientation", value),
    onChangeArmHandPosition: (value) =>
      updateDataField?.("arm_hand_position", value),
    onChangeLegFootPosition: (value) =>
      updateDataField?.("leg_foot_position", value),
    onChangeFacialExpression: (value) =>
      updateDataField?.("facial_expression", value),
    onChangeBalanceWeight: (value) =>
      updateDataField?.("balance_weight", value),
    onChangeBodyPositionNotes: (value) =>
      updateDataField?.("body_position_notes", value),
  };
}

export function usePoseBodyPositionSectionViewModel(props = {}) {
  return getPoseBodyPositionSectionViewProps(props);
}
