const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Pose Identity",
  sectionDescription:
    "Define what this pose is, how it should be categorized, and how it may be reused as an Image Studio pose ingredient.",
  nameLabel: "Pose Name",
  categoryLabel: "Pose Type / Category",
  intendedUseLabel: "Intended Use",
  tagsLabel: "Tags",
  creationTypeLabel: "Creation Type",
});

export function formatPoseIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parsePoseIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getPoseIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    nameValue: data.name ?? form?.title ?? "",
    categoryValue: data.category || data.pose_type || "",
    intendedUseValue: data.intended_use || "",
    tagsValue: formatPoseIdentityTags(data.tags),
    creationTypeValue: form?.type || "",
    onChangeName: (value) => updateDataField?.("name", value),
    onChangeCategory: (value) => updateDataField?.("category", value),
    onChangeIntendedUse: (value) =>
      updateDataField?.("intended_use", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parsePoseIdentityTags(value)),
  };
}

export function usePoseIdentitySectionViewModel(props = {}) {
  return getPoseIdentitySectionViewProps(props);
}
