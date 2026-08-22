import {
  CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
  genderPresentationOptions,
  roleArchetypeOptions,
  speciesOptions,
} from "@/components/studio/create/character/constants/constants";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Creation Editor",
  sectionTitle: "Identity",
  sectionDescription:
    "Edit the character-specific identity fields stored in this creation’s data payload.",
  characterNameLabel: "Character Name",
  characterTitleLabel: "Character Title",
  speciesLabel: "Species",
  customSpeciesLabel: "Custom Species",
  renderingStyleLabel: "Default Rendering Style",
  ageLabel: "Age",
  agePlaceholder: "18+",
  ageHelpText:
    "Adult characters only. Used for narration and lore context, not visual aging.",
  genderPresentationLabel: "Gender Presentation",
  customGenderPresentationLabel: "Custom Gender Presentation",
  roleArchetypeLabel: "Role Archetype",
  roleArchetypeModalTitle: "Select Role Archetype",
  creationTypeLabel: "Creation Type",
});

export const CHARACTER_RENDERING_STYLE_OPTIONS = Object.freeze([
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
]);

export const CHARACTER_ROLE_ARCHETYPE_GROUPS = Object.freeze([
  "Fantasy",
  "Modern",
  "Sci-Fi",
]);

// Terminology map (4.6, D8/F2): a raw data-layer enum never surfaces
// to the screen. CHARACTER is this section's own value; the sibling
// CHARACTER_TEMPLATE mapping mirrors the same map in
// character-template-fields-section/useCharacterTemplateFieldsSectionViewModel.js.
const CREATION_TYPE_LABELS = Object.freeze({
  CHARACTER: "Character",
  CHARACTER_TEMPLATE: "Character Template",
});

export function clampAdultCharacterAge(value) {
  if (value === null || value === undefined || value === "") return "";

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);

  return numericValue < 18 ? "18" : String(value);
}

export function limitCustomIdentityValue(value) {
  return String(value || "").slice(0, CUSTOM_APPEARANCE_VALUE_MAX_LENGTH);
}

export function getCharacterIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    characterNameValue: data.name ?? form?.title ?? "",
    characterTitleValue: data.title || "",
    speciesValue: data.species || "",
    speciesOptions,
    showCustomSpecies: data.species === "CUSTOM",
    customSpeciesValue: data.custom_species || "",
    customIdentityMaxLength: CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
    renderingStyleValue: data.rendering_style || "EITHER",
    renderingStyleOptions: CHARACTER_RENDERING_STYLE_OPTIONS,
    ageValue: data.age || "",
    ageMinimum: 18,
    genderPresentationValue: data.gender_presentation || "",
    genderPresentationOptions,
    showCustomGenderPresentation:
      data.gender_presentation === "CUSTOM",
    customGenderPresentationValue:
      data.custom_gender_presentation || "",
    colorPaletteValue:
      data.character_color_palette_id || "CRESTFALL_DEFAULT",
    roleArchetypeValue: data.short_concept || "",
    roleArchetypeOptions,
    roleArchetypeGroups: CHARACTER_ROLE_ARCHETYPE_GROUPS,
    roleArchetypeColumns: 3,
    creationTypeValue: CREATION_TYPE_LABELS[form?.type] || form?.type || "",
    onChangeCharacterName: (value) => updateDataField?.("name", value),
    onChangeCharacterTitle: (value) => updateDataField?.("title", value),
    onSelectSpecies: (value) => updateDataField?.("species", value),
    onChangeCustomSpecies: (value) =>
      updateDataField?.("custom_species", limitCustomIdentityValue(value)),
    onSelectRenderingStyle: (value) =>
      updateDataField?.("rendering_style", value),
    onChangeAge: (value) => updateDataField?.("age", value),
    onCommitAge: (value) =>
      updateDataField?.("age", clampAdultCharacterAge(value)),
    onSelectGenderPresentation: (value) =>
      updateDataField?.("gender_presentation", value),
    onChangeCustomGenderPresentation: (value) =>
      updateDataField?.(
        "custom_gender_presentation",
        limitCustomIdentityValue(value)
      ),
    onSelectColorPalette: (value) =>
      updateDataField?.("character_color_palette_id", value),
    onSelectRoleArchetype: (value) =>
      updateDataField?.("short_concept", value),
  };
}

export function useCharacterIdentitySectionViewModel(props = {}) {
  return getCharacterIdentitySectionViewProps(props);
}
