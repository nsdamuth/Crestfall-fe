const baseFixture = {
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Motion / Staging",
  sectionDescription:
    "Define action energy, staging, prop interaction, viewer relation, and how this pose should feel in generated images.",
  actionMotionLabel: "Action / Motion",
  actionMotionValue: "Stepping forward while raising a lantern",
  energyLevelLabel: "Energy Level",
  energyLevelValue: "Controlled tension with restrained forward momentum",
  viewerRelationLabel: "Viewer Relation",
  viewerRelationValue: "Three-quarter approach toward the viewer",
  propInteractionLabel: "Prop Interaction",
  propInteractionValue: "Lantern held above shoulder height; free hand near weapon",
  sceneFitLabel: "Scene Fit",
  sceneFitValue: "Ruined gate, narrow alley, or cautious exploration scene",
  moodAttitudeLabel: "Mood / Attitude",
  moodAttitudeValue: "Alert, suspicious, and ready to react",
  stagingNotesLabel: "Staging Notes",
  stagingNotesValue:
    "Keep the lantern separated from the face and silhouette the free hand clearly against the coat. Preserve room in front of the character for implied movement.",
  stagingNotesPlaceholder:
    "Describe how the pose should be staged in relation to space, props, clothing, action, expression, and scene mood.",
  onChangeActionMotion: null,
  onChangeEnergyLevel: null,
  onChangeViewerRelation: null,
  onChangePropInteraction: null,
  onChangeSceneFit: null,
  onChangeMoodAttitude: null,
  onChangeStagingNotes: null,
};

export const poseMotionStagingSectionDefaultFixture = {
  ...baseFixture,
};

export const poseMotionStagingSectionEmptyFixture = {
  ...baseFixture,
  actionMotionValue: "",
  energyLevelValue: "",
  viewerRelationValue: "",
  propInteractionValue: "",
  sceneFitValue: "",
  moodAttitudeValue: "",
  stagingNotesValue: "",
};

export const poseMotionStagingSectionQuietFixture = {
  ...baseFixture,
  actionMotionValue: "Standing still beside a rain-streaked window",
  energyLevelValue: "Low and contemplative",
  viewerRelationValue: "Profile view with the gaze directed outside frame",
  propInteractionValue: "One hand rests lightly against the window frame",
  sceneFitValue: "Quiet interior, reflective pause, or late-night conversation",
  moodAttitudeValue: "Melancholic and introspective",
  stagingNotesValue:
    "Use negative space behind the subject and avoid any exaggerated gesture that would undermine the restrained mood.",
};

export const poseMotionStagingSectionActionFixture = {
  ...baseFixture,
  actionMotionValue: "Rapid lateral dodge while drawing a blade",
  energyLevelValue: "Explosive and urgent",
  viewerRelationValue: "Low-angle diagonal crossing the frame",
  propInteractionValue: "Blade clears the sheath as the coat trails behind",
  sceneFitValue: "Combat, ambush, or collapsing-environment sequence",
  moodAttitudeValue: "Focused aggression",
  stagingNotesValue:
    "Keep the weapon path readable, prevent limb tangencies, and show believable weight transfer through the planted foot.",
};

export const poseMotionStagingSectionLongContentFixture = {
  ...baseFixture,
  actionMotionValue:
    "A cautious forward step transitions into a defensive pivot as the character detects movement beyond the visible ruined archway",
  energyLevelValue:
    "Layered tension that begins restrained but suggests an immediate burst of speed, defensive force, or evasive movement",
  viewerRelationValue:
    "The character crosses the frame on a shallow diagonal while turning the face and upper torso back toward the viewer and unseen threat",
  propInteractionValue:
    "The raised lantern casts light across the face, coat, weapon hand, ground plane, and nearby masonry without obscuring fingers or silhouette",
  sceneFitValue:
    "A narrow storm-damaged passage with hanging fabric, broken stone, drifting dust, and enough foreground depth to communicate cautious exploration",
  moodAttitudeValue:
    "Watchful suspicion mixed with duty, fatigue, and the controlled confidence of someone accustomed to dangerous environments",
  stagingNotesValue:
    "Maintain clear separation between the lantern, face, shoulders, weapon, coat hem, knees, and feet. The implied motion should remain physically plausible while preserving a cinematic silhouette and enough environmental context to show why the character is moving cautiously.",
};

export const poseMotionStagingSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Pose Ingredient",
  sectionTitle: "Action and Scene Direction",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  actionMotionLabel: "Primary Action",
  energyLevelLabel: "Movement Intensity",
  viewerRelationLabel: "Camera Relationship",
  propInteractionLabel: "Object Interaction",
  sceneFitLabel: "Best-Fit Scene",
  moodAttitudeLabel: "Emotional Attitude",
  stagingNotesLabel: "Detailed Staging Direction",
};

export const poseMotionStagingSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeActionMotion: null,
  onChangeEnergyLevel: null,
  onChangeViewerRelation: null,
  onChangePropInteraction: null,
  onChangeSceneFit: null,
  onChangeMoodAttitude: null,
  onChangeStagingNotes: null,
};
