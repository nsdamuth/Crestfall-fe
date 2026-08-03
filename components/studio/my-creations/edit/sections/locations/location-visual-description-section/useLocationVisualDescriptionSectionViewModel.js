"use client";

const DEFAULT_COPY = Object.freeze({
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
});

export function normalizeLocationVisualDescriptionData(data = {}) {
  const source = data && typeof data === "object" && !Array.isArray(data)
    ? data
    : {};

  return {
    architecture: source.architecture || "",
    materials: source.materials || "",
    visualMotifs: source.visual_motifs || "",
    landmarks: source.landmarks || "",
    layout: source.layout || source.spatial_design || "",
    designNotes: source.design_notes || source.design_reference || "",
  };
}

export function useLocationVisualDescriptionSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const values = normalizeLocationVisualDescriptionData(form?.data);

  return {
    ...DEFAULT_COPY,
    architectureValue: values.architecture,
    materialsValue: values.materials,
    visualMotifsValue: values.visualMotifs,
    landmarksValue: values.landmarks,
    layoutValue: values.layout,
    designNotesValue: values.designNotes,
    onChangeArchitecture: (value) =>
      updateDataField?.("architecture", value),
    onChangeMaterials: (value) => updateDataField?.("materials", value),
    onChangeVisualMotifs: (value) =>
      updateDataField?.("visual_motifs", value),
    onChangeLandmarks: (value) => updateDataField?.("landmarks", value),
    onChangeLayout: (value) => updateDataField?.("layout", value),
    onChangeDesignNotes: (value) =>
      updateDataField?.("design_notes", value),
  };
}
