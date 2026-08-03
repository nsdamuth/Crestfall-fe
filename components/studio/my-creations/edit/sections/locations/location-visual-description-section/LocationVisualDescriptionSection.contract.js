export const LOCATION_VISUAL_DESCRIPTION_SECTION_VIEW_CONTRACT_VERSION =
  "locationVisualDescriptionSection.view.v1";

export const LOCATION_VISUAL_DESCRIPTION_SECTION_VIEW_CONTRACT = Object.freeze({
  feature: "LocationVisualDescriptionSection",
  version: LOCATION_VISUAL_DESCRIPTION_SECTION_VIEW_CONTRACT_VERSION,
  boundary:
    "Portable View receives display-ready strings and semantic field callbacks only.",
  viewInputs: Object.freeze([
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "architectureLabel",
    "architectureValue",
    "materialsLabel",
    "materialsValue",
    "visualMotifsLabel",
    "visualMotifsValue",
    "landmarksLabel",
    "landmarksValue",
    "layoutLabel",
    "layoutValue",
    "layoutPlaceholder",
    "designNotesLabel",
    "designNotesValue",
    "designNotesPlaceholder",
  ]),
  semanticCallbacks: Object.freeze([
    "onChangeArchitecture",
    "onChangeMaterials",
    "onChangeVisualMotifs",
    "onChangeLandmarks",
    "onChangeLayout",
    "onChangeDesignNotes",
  ]),
  storageFields: Object.freeze([
    "architecture",
    "materials",
    "visual_motifs",
    "landmarks",
    "layout",
    "design_notes",
  ]),
  legacyReadFields: Object.freeze([
    "spatial_design",
    "design_reference",
  ]),
  applicationOwned: Object.freeze([
    "Creation Edit form hydration",
    "legacy field fallback resolution",
    "JSONB storage-key mapping",
    "save orchestration",
    "persistence",
  ]),
});
