const sharedCopy = {
  sectionEyebrow: "Location Editor",
  sectionTitle: "Visual Description",
  sectionDescription:
    "Describe the physical design, architecture, layout, landmarks, and visual motifs of this location asset.",
  architectureLabel: "Architecture / Structure",
  materialsLabel: "Materials",
  visualMotifsLabel: "Visual Motifs",
  landmarksLabel: "Landmarks",
  layoutLabel: "Layout / Spatial Design",
  layoutPlaceholder:
    "Describe room layout, paths, scale, major zones, entry points, sightlines, or environmental structure.",
  designNotesLabel: "Design Notes",
  designNotesPlaceholder:
    "Describe the location's visual identity, recognizable details, atmosphere, and design intent.",
};

export const locationVisualDescriptionCompleteFixture = Object.freeze({
  ...sharedCopy,
  architectureValue: "White stone arcades reinforced with warm brass ribs",
  materialsValue: "Polished marble, dark wood, brass, glass, and worked leather",
  visualMotifsValue: "Crescents, lens arrays, clockwork flowers, and layered arches",
  landmarksValue: "Seven-lock front door, central appraisal bench, and warded cabinets",
  layoutValue:
    "A narrow public storefront opens into a deep workshop with side counters, a central workbench, locked rear storage, and a concealed stairwell.",
  designNotesValue:
    "The space should feel commercially active, clever, warm, guarded, and unmistakably shaped by an artificer who values useful beauty.",
});

export const locationVisualDescriptionLegacyFixture = Object.freeze({
  ...sharedCopy,
  architectureValue: "Tiered archive tower",
  materialsValue: "Black stone and smoked glass",
  visualMotifsValue: "Vertical records, narrow lights, and repeated seal marks",
  landmarksValue: "Suspended index chamber",
  layoutValue:
    "Legacy spatial_design fallback: concentric archive rings surround a central lift.",
  designNotesValue:
    "Legacy design_reference fallback: severe institutional geometry softened by handwritten records.",
});

export const locationVisualDescriptionSparseFixture = Object.freeze({
  ...sharedCopy,
  architectureValue: "Open-air market arcade",
  materialsValue: "",
  visualMotifsValue: "Layered awnings",
  landmarksValue: "",
  layoutValue: "",
  designNotesValue: "",
});

export const locationVisualDescriptionEmptyFixture = Object.freeze({
  ...sharedCopy,
  architectureValue: "",
  materialsValue: "",
  visualMotifsValue: "",
  landmarksValue: "",
  layoutValue: "",
  designNotesValue: "",
});
