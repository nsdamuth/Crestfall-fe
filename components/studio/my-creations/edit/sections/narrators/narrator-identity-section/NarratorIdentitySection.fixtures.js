const toneOptions = [
  { value: "", label: "Not chosen" },
  { value: "CINEMATIC", label: "Cinematic" },
  { value: "LITERARY", label: "Literary" },
  { value: "DARK_FAIRYTALE", label: "Dark Fairytale" },
  { value: "NOIR", label: "Noir" },
  { value: "EPIC_FANTASY", label: "Epic Fantasy" },
  { value: "HORROR", label: "Horror" },
  { value: "ROMANTIC", label: "Romantic" },
  { value: "COMEDIC", label: "Comedic" },
  { value: "NEUTRAL", label: "Neutral" },
];

const baseFixture = {
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Identity",
  sectionDescription:
    "Define the narrator's reusable story voice, broad style, and discovery metadata.",
  nameLabel: "Narrator Name",
  nameValue: "The Lantern Keeper",
  tagsLabel: "Tags",
  tagsValue: "cinematic, dark fantasy, atmospheric",
  toneLabel: "Tone",
  toneValue: "CINEMATIC",
  toneOptions,
  creationTypeLabel: "Creation Type",
  creationTypeValue: "NARRATOR",
  onChangeName: null,
  onChangeTags: null,
  onSelectTone: null,
};

export const narratorIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const narratorIdentitySectionEmptyFixture = {
  ...baseFixture,
  nameValue: "",
  tagsValue: "",
  toneValue: "",
};

export const narratorIdentitySectionTitleFallbackFixture = {
  ...baseFixture,
  nameValue: "Narrator Draft Title",
  tagsValue: "mystery, ensemble",
  toneValue: "NOIR",
};

export const narratorIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Narrator Identity for a Long-Form Multi-Realm Chronicle Voice",
  sectionDescription:
    "Define a narrator whose reusable voice must remain recognizable across a large ensemble, multiple regions, shifting timelines, and extended story arcs without changing the underlying creation or persistence contract.",
  nameValue:
    "The Last Archivist of the Unreasonably Long and Complicated Chronicle",
  tagsValue:
    "cinematic, literary, multi-realm, atmospheric, ensemble, long-form, mystery, mythic history",
  creationTypeValue: "NARRATOR",
};

export const narratorIdentitySectionNoToneOptionsFixture = {
  ...baseFixture,
  toneValue: "",
  toneOptions: [],
};

export const narratorIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeName: null,
  onChangeTags: null,
  onSelectTone: null,
};
