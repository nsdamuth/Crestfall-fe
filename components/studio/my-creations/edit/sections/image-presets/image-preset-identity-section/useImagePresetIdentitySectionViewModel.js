const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Preset Identity",
  sectionDescription:
    "Define what this image preset is, how it should be categorized, and how it may be reused as an Image Studio style ingredient.",
  nameLabel: "Preset Name",
  categoryLabel: "Style Family / Category",
  intendedUseLabel: "Intended Use",
  tagsLabel: "Tags",
  creationTypeLabel: "Creation Type",
});

export function formatImagePresetIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseImagePresetIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getImagePresetIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    nameValue: data.name ?? form?.title ?? "",
    categoryValue: data.category || data.style_family || "",
    intendedUseValue: data.intended_use || "",
    tagsValue: formatImagePresetIdentityTags(data.tags),
    creationTypeValue: form?.type || "",
    onChangeName: (value) => updateDataField?.("name", value),
    onChangeCategory: (value) => updateDataField?.("category", value),
    onChangeIntendedUse: (value) =>
      updateDataField?.("intended_use", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parseImagePresetIdentityTags(value)),
  };
}

export function useImagePresetIdentitySectionViewModel(props = {}) {
  return getImagePresetIdentitySectionViewProps(props);
}
