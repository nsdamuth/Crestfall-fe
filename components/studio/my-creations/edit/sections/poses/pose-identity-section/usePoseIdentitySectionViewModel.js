import {
  POSE_CATEGORY_OPTIONS,
  normalizePoseSemantics,
} from "@/lib/shared/creations/poseSemantics";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Pose Identity",
  sectionDescription:
    "Define what this pose is and how creators can discover or reuse it. Runtime matching metadata remains separate from public tags.",
  nameLabel: "Pose Name",
  categoryLabel: "Pose Type / Category",
  categoryHelper:
    "Broad discovery taxonomy. This does not replace the more precise Posture field.",
  intendedUseLabel: "Intended Use",
  intendedUseHelper:
    "Human-facing guidance for when this pose is useful; not inserted directly into image prompts.",
  tagsLabel: "Tags",
  tagsHelper:
    "Public discovery tags. Automatic chat matching uses internal pose_match metadata instead.",
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
  const semantics = normalizePoseSemantics(data);

  return {
    ...DEFAULT_COPY,
    nameValue: data.name ?? form?.title ?? "",
    categoryValue: semantics.category,
    categoryOptions: POSE_CATEGORY_OPTIONS,
    intendedUseValue: semantics.intended_use,
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
