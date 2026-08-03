const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Body Position",
  sectionDescription:
    "Describe the body placement, posture, limb arrangement, balance, and expression of this pose.",
  postureLabel: "Posture",
  bodyOrientationLabel: "Body Orientation",
  armHandPositionLabel: "Arm / Hand Position",
  legFootPositionLabel: "Leg / Foot Position",
  facialExpressionLabel: "Facial Expression",
  balanceWeightLabel: "Balance / Weight",
  bodyPositionNotesLabel: "Body Position Notes",
  bodyPositionNotesPlaceholder:
    "Describe exact pose details: where the torso, head, arms, hands, legs, feet, and gaze should be.",
});

export function getPoseBodyPositionSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    postureValue: data.posture || "",
    bodyOrientationValue: data.body_orientation || "",
    armHandPositionValue: data.arm_hand_position || "",
    legFootPositionValue: data.leg_foot_position || "",
    facialExpressionValue: data.facial_expression || "",
    balanceWeightValue: data.balance_weight || "",
    bodyPositionNotesValue: data.body_position_notes || "",
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
