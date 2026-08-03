const baseFixture = {
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Body Position",
  sectionDescription:
    "Describe the body placement, posture, limb arrangement, balance, and expression of this pose.",
  postureLabel: "Posture",
  postureValue: "Upright defensive stance with the torso slightly lowered",
  bodyOrientationLabel: "Body Orientation",
  bodyOrientationValue: "Three-quarter turn toward the viewer's left",
  armHandPositionLabel: "Arm / Hand Position",
  armHandPositionValue:
    "Left hand raises a lantern; right hand rests near the weapon hilt",
  legFootPositionLabel: "Leg / Foot Position",
  legFootPositionValue:
    "Feet shoulder-width apart with the rear foot angled outward",
  facialExpressionLabel: "Facial Expression",
  facialExpressionValue: "Alert, focused, and wary",
  balanceWeightLabel: "Balance / Weight",
  balanceWeightValue: "Weight centered with a slight shift to the rear leg",
  bodyPositionNotesLabel: "Body Position Notes",
  bodyPositionNotesValue:
    "Keep the head aligned with the lantern, shoulders tense, elbows relaxed, and the gaze directed beyond the viewer.",
  bodyPositionNotesPlaceholder:
    "Describe exact pose details: where the torso, head, arms, hands, legs, feet, and gaze should be.",
  onChangePosture: null,
  onChangeBodyOrientation: null,
  onChangeArmHandPosition: null,
  onChangeLegFootPosition: null,
  onChangeFacialExpression: null,
  onChangeBalanceWeight: null,
  onChangeBodyPositionNotes: null,
};

export const poseBodyPositionSectionDefaultFixture = {
  ...baseFixture,
};

export const poseBodyPositionSectionEmptyFixture = {
  ...baseFixture,
  postureValue: "",
  bodyOrientationValue: "",
  armHandPositionValue: "",
  legFootPositionValue: "",
  facialExpressionValue: "",
  balanceWeightValue: "",
  bodyPositionNotesValue: "",
};

export const poseBodyPositionSectionUpperBodyFixture = {
  ...baseFixture,
  postureValue: "Relaxed seated posture",
  bodyOrientationValue: "Front-facing portrait orientation",
  armHandPositionValue: "Hands folded loosely at chest height",
  legFootPositionValue: "Outside the cropped frame",
  facialExpressionValue: "Calm and contemplative",
  balanceWeightValue: "Supported by the chair back",
  bodyPositionNotesValue:
    "Frame from the waist upward and preserve relaxed shoulder alignment.",
};

export const poseBodyPositionSectionDynamicFixture = {
  ...baseFixture,
  postureValue: "Low forward lunge",
  bodyOrientationValue: "Strong diagonal across the frame",
  armHandPositionValue: "Leading arm extended; trailing arm pulled back",
  legFootPositionValue: "Front knee bent deeply; rear leg fully extended",
  facialExpressionValue: "Determined with clenched jaw",
  balanceWeightValue: "Momentum committed over the front foot",
  bodyPositionNotesValue:
    "Use asymmetry and visible tension through the shoulders, hips, and planted foot.",
};

export const poseBodyPositionSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Body Position for a Highly Specific Multi-Character Cinematic Pose Ingredient",
  sectionDescription:
    "Describe a detailed body arrangement that must remain readable across wide environmental compositions, layered clothing, complex props, dynamic camera angles, and multiple character proportions.",
  postureValue:
    "A deliberately asymmetrical guarded posture with the torso lowered, shoulders rotated in opposite directions, and the head lifted against the line of the spine",
  bodyOrientationValue:
    "Three-quarter rear orientation that still exposes the face, chest silhouette, prop hand, and forward leg to the camera",
  armHandPositionValue:
    "The leading hand grips a weathered lantern above shoulder level while the trailing hand hovers near a sheathed weapon with individually articulated fingers",
  legFootPositionValue:
    "The forward foot braces against uneven stone while the rear leg remains extended across the frame to establish a stable triangular silhouette",
  facialExpressionValue:
    "Watchful suspicion with narrowed eyes, compressed lips, raised cheek tension, and a gaze fixed beyond the visible scene",
  balanceWeightValue:
    "Most weight remains over the rear hip while the forward leg tests the terrain without appearing weightless or unstable",
  bodyPositionNotesValue:
    "Maintain a readable silhouette around the lantern, hands, elbows, weapon, knees, and feet. Avoid tangencies between limbs and clothing while keeping the pose physically plausible for a long-coat costume in a windy ruined-gate environment.",
};

export const poseBodyPositionSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Pose Ingredient",
  sectionTitle: "Physical Arrangement",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  postureLabel: "Core Posture",
  bodyOrientationLabel: "Camera-Facing Orientation",
  armHandPositionLabel: "Upper-Limb Placement",
  legFootPositionLabel: "Lower-Limb Placement",
  facialExpressionLabel: "Expression Direction",
  balanceWeightLabel: "Weight Distribution",
  bodyPositionNotesLabel: "Detailed Arrangement Notes",
};

export const poseBodyPositionSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangePosture: null,
  onChangeBodyOrientation: null,
  onChangeArmHandPosition: null,
  onChangeLegFootPosition: null,
  onChangeFacialExpression: null,
  onChangeBalanceWeight: null,
  onChangeBodyPositionNotes: null,
};
