const NARRATOR_TONE_OPTIONS = Object.freeze([
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
]);

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Identity",
  sectionDescription:
    "Define the narrator's reusable story voice, broad style, and discovery metadata.",
  nameLabel: "Narrator Name",
  tagsLabel: "Tags",
  toneLabel: "Tone",
  creationTypeLabel: "Creation Type",
});

export function formatNarratorIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseNarratorIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getNarratorIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    nameValue: data.name || form?.title || "",
    tagsValue: formatNarratorIdentityTags(data.tags),
    toneValue: data.tone || "",
    toneOptions: NARRATOR_TONE_OPTIONS.map((option) => ({ ...option })),
    creationTypeValue: form?.type || "",
    onChangeName: (value) => updateDataField?.("name", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parseNarratorIdentityTags(value)),
    onSelectTone: (value) => updateDataField?.("tone", value),
  };
}

export function useNarratorIdentitySectionViewModel(props = {}) {
  return getNarratorIdentitySectionViewProps(props);
}
