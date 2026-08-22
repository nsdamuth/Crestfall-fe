const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Creation Editor",
  sectionTitle: "Overview",
  sectionDescription:
    "Quick creation gets users here; serious editing, publishing, review, and deletion live here.",
  titleLabel: "Title",
  descriptionLabel: "Public Description",
  descriptionPlaceholder:
    "Describe this creation for public or private viewing.",
  previewButtonLabel: "Preview",
});

function normalizeText(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

export function getCreationOverviewSectionViewProps({
  form = {},
  updateField = null,
  onPreview = null,
  previewDisabled = true,
} = {}) {
  return {
    ...DEFAULT_COPY,
    titleValue: normalizeText(form?.title),
    descriptionValue: normalizeText(form?.description),
    previewDisabled: Boolean(previewDisabled),
    onChangeTitle: (value) => updateField?.("title", value),
    onChangeDescription: (value) => updateField?.("description", value),
    onPreview: () => onPreview?.(),
  };
}

export function useCreationOverviewSectionViewModel(props = {}) {
  return getCreationOverviewSectionViewProps(props);
}
