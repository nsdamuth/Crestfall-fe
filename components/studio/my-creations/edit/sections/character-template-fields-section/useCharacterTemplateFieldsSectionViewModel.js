import {
  bodyTypeOptions,
  buildOptions,
  eastAsianZodiacOptions,
  heightOptions,
  interestOptions,
  mbtiTypeOptions,
  movementStyleOptions,
  proportionOptions,
  roleArchetypeOptions,
  speechStyleOptions,
  westernZodiacOptions,
} from "@/components/studio/create/character/constants/constants";

const SECTION_COPY = Object.freeze({
  template: {
    sectionTitle: "Template Info",
    sectionDescription:
      "Edit the reusable blueprint metadata shown in My Creations and template pickers.",
  },
  identity: {
    sectionTitle: "Identity Defaults",
    sectionDescription:
      "Edit optional defaults copied into the Identity step of new character creation.",
  },
  appearance: {
    sectionTitle: "Appearance Defaults",
    sectionDescription:
      "Edit reusable visual defaults for new character drafts.",
  },
  body: {
    sectionTitle: "Body Defaults",
    sectionDescription:
      "Edit optional physical silhouette defaults for new character drafts.",
  },
  behavior: {
    sectionTitle: "Behavior Defaults",
    sectionDescription:
      "Edit optional defaults for personality, voice, movement, and interests.",
  },
});

export const CHARACTER_TEMPLATE_SPECIES_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "HUMAN", label: "Human" },
  { value: "BASTET", label: "Bastet / Catfolk" },
  { value: "KITSUNE", label: "Kitsune" },
  { value: "LAMIA", label: "Lamia / Gorgon" },
  { value: "GENIE", label: "Genie" },
  { value: "CONSTRUCT", label: "Construct / Robot" },
  { value: "DEMON", label: "Demon" },
  { value: "ANGEL", label: "Angel" },
  { value: "ELF", label: "Elf" },
  { value: "ALIEN", label: "Alien" },
  { value: "MERFOLK", label: "Merfolk" },
  { value: "CUSTOM", label: "Custom" },
]);

export const CHARACTER_TEMPLATE_GENDER_PRESENTATION_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "ANDROGYNOUS", label: "Androgynous" },
  { value: "CUSTOM", label: "Custom" },
]);

export const CHARACTER_TEMPLATE_VERBOSITY_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "1", label: "1 · Terse" },
  { value: "2", label: "2 · Concise" },
  { value: "3", label: "3 · Balanced" },
  { value: "4", label: "4 · Expressive" },
  { value: "5", label: "5 · Highly Verbose" },
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function formatCharacterTemplateTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value || "");
}

export function parseCharacterTemplateTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeCharacterTemplateProportions(fields = {}) {
  if (Array.isArray(fields.proportions)) {
    return fields.proportions.filter(Boolean);
  }

  if (fields.proportions) return [fields.proportions];
  if (fields.hips_waist_shoulders) return [fields.hips_waist_shoulders];
  return [];
}

export function getCharacterTemplateFieldsSectionModel({
  section = "template",
  form = {},
  updateField = null,
  updateDataField = null,
} = {}) {
  const data = normalizeObject(form?.data);
  const templateFields = normalizeObject(data.fields);
  const templateForm = {
    ...templateFields,
    proportions: normalizeCharacterTemplateProportions(templateFields),
  };
  const sectionCopy = SECTION_COPY[section] || SECTION_COPY.template;

  function updateTemplateFormField(field, value) {
    const nextFields = {
      ...templateFields,
      [field]: value,
    };

    if (field === "proportions") {
      nextFields.hips_waist_shoulders = "";
    }

    updateDataField?.("fields", nextFields);
  }

  function updateTemplateFormFields(updates = {}) {
    const nextFields = {
      ...templateFields,
      ...normalizeObject(updates),
    };

    if (Object.prototype.hasOwnProperty.call(updates, "proportions")) {
      nextFields.hips_waist_shoulders = "";
    }

    updateDataField?.("fields", nextFields);
  }

  return {
    viewProps: {
      activeSection: section,
      sectionEyebrow: "Character Template Editor",
      ...sectionCopy,
      templateNameValue: form?.title || "",
      categoryValue: data.template_category || "",
      shortDescriptionValue: form?.description || "",
      shortDescriptionPlaceholder:
        "A short creator-facing summary of what this template helps create.",
      tagsValue: formatCharacterTemplateTags(data.template_tags),
      creationTypeValue: form?.type || "",
      appliesToValue: "New characters only",
      defaultNameValue: templateFields.name || "",
      defaultTitleValue: templateFields.title || "",
      speciesValue: templateFields.species || "",
      speciesOptions: CHARACTER_TEMPLATE_SPECIES_OPTIONS,
      genderPresentationValue: templateFields.gender_presentation || "",
      genderPresentationOptions:
        CHARACTER_TEMPLATE_GENDER_PRESENTATION_OPTIONS,
      clothingStyleValue: templateFields.clothing_style || "",
      bodyNotesValue: templateFields.body_notes || "",
      bodyNotesPlaceholder:
        "Optional physical details that should affect image generation or narration.",
      verbosityValue: templateFields.verbosity_level || "",
      verbosityOptions: CHARACTER_TEMPLATE_VERBOSITY_OPTIONS,
      philosophyValue: templateFields.philosophy || "",
      philosophyPlaceholder:
        "What does this archetype believe about the world?",
      onChangeTemplateName: (value) => updateField?.("title", value),
      onChangeCategory: (value) =>
        updateDataField?.("template_category", value),
      onChangeShortDescription: (value) =>
        updateField?.("description", value),
      onChangeTags: (value) =>
        updateDataField?.("template_tags", parseCharacterTemplateTags(value)),
      onChangeDefaultName: (value) =>
        updateTemplateFormField("name", value),
      onChangeDefaultTitle: (value) =>
        updateTemplateFormField("title", value),
      onSelectSpecies: (value) =>
        updateTemplateFormField("species", value),
      onSelectGenderPresentation: (value) =>
        updateTemplateFormField("gender_presentation", value),
      onChangeClothingStyle: (value) =>
        updateTemplateFormField("clothing_style", value),
      onChangeBodyNotes: (value) =>
        updateTemplateFormField("body_notes", value),
      onSelectVerbosity: (value) =>
        updateTemplateFormField("verbosity_level", value),
      onChangePhilosophy: (value) =>
        updateTemplateFormField("philosophy", value),
    },
    applicationControlProps: {
      templateForm,
      updateTemplateFormField,
      updateTemplateFormFields,
      roleArchetypeValue: templateFields.short_concept || "",
      roleArchetypeOptions,
      roleArchetypeGroups: ["Fantasy", "Modern", "Sci-Fi"],
      bodyTypeOptions,
      heightOptions,
      buildOptions,
      proportionOptions,
      mbtiTypeOptions,
      westernZodiacOptions,
      eastAsianZodiacOptions,
      speechStyleOptions,
      movementStyleOptions,
      interestOptions,
    },
  };
}

export function useCharacterTemplateFieldsSectionViewModel(props = {}) {
  return getCharacterTemplateFieldsSectionModel(props);
}
