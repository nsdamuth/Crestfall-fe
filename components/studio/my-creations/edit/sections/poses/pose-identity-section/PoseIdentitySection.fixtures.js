const baseFixture = {
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Pose Identity",
  sectionDescription:
    "Define what this pose is, how it should be categorized, and how it may be reused as an Image Studio pose ingredient.",
  nameLabel: "Pose Name",
  nameValue: "Lantern Guard Stance",
  categoryLabel: "Pose Type / Category",
  categoryValue: "Defensive Standing",
  intendedUseLabel: "Intended Use",
  intendedUseValue: "Character portraits and tense corridor scenes",
  tagsLabel: "Tags",
  tagsValue: "defensive, standing, lantern, alert",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "POSE",
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};

export const poseIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const poseIdentitySectionEmptyFixture = {
  ...baseFixture,
  nameValue: "",
  categoryValue: "",
  intendedUseValue: "",
  tagsValue: "",
};

export const poseIdentitySectionTitleFallbackFixture = {
  ...baseFixture,
  nameValue: "Pose Draft Title",
  categoryValue: "Action",
  intendedUseValue: "Image Studio action compositions",
  tagsValue: "action, dynamic",
};

export const poseIdentitySectionLegacyCategoryFixture = {
  ...baseFixture,
  nameValue: "Seated Council Pose",
  categoryValue: "Seated",
  intendedUseValue: "Council scenes and formal discussions",
  tagsValue: "seated, formal, council",
};

export const poseIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Pose Identity for a Highly Specific Multi-Character Cinematic Staging Ingredient",
  sectionDescription:
    "Define a reusable pose whose identity must remain understandable across detailed Image Studio compositions, multiple character types, layered clothing, props, complex staging, and long-form visual storytelling workflows.",
  nameValue:
    "The Extremely Deliberate Last-Stand Lantern Guard Posture at the Ruined Gate",
  categoryValue:
    "Defensive Full-Body Environmental Character Staging and Prop Interaction",
  intendedUseValue:
    "Wide cinematic compositions, ensemble confrontations, armored character portraits, ruined architecture scenes, and high-tension fantasy storytelling",
  tagsValue:
    "defensive, full-body, lantern, ruined gate, cinematic, ensemble, armored, tense, environmental staging",
};

export const poseIdentitySectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Pose Ingredient",
  sectionTitle: "Discovery Identity",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  nameLabel: "Display Name",
  categoryLabel: "Library Category",
  intendedUseLabel: "Recommended Usage",
  tagsLabel: "Discovery Tags",
};

export const poseIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};
