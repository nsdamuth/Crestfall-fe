const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Outfit Identity",
  sectionDescription:
    "Define what this outfit is, how it should be categorized, and where it belongs as a reusable visual asset.",
  nameLabel: "Outfit Name",
  categoryLabel: "Outfit Type / Category",
  intendedUseLabel: "Intended Use",
  tagsLabel: "Tags",
  creationTypeLabel: "Creation Type",
});

export function formatOutfitIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseOutfitIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getOutfitIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    nameValue: data.name ?? form?.title ?? "",
    categoryValue: data.category || data.outfit_type || "",
    intendedUseValue: data.intended_use || "",
    tagsValue: formatOutfitIdentityTags(data.tags),
    creationTypeValue: form?.type || "",
    onChangeName: (value) => updateDataField?.("name", value),
    onChangeCategory: (value) => updateDataField?.("category", value),
    onChangeIntendedUse: (value) =>
      updateDataField?.("intended_use", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parseOutfitIdentityTags(value)),
  };
}

export function useOutfitIdentitySectionViewModel(props = {}) {
  return getOutfitIdentitySectionViewProps(props);
}
