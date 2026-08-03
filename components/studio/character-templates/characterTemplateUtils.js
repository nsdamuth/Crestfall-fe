export const EMPTY_CHARACTER_TEMPLATE_FORM = {
  title: "",
  category: "",
  description: "",
  tags: "",

  name: "",
  character_title: "",
  species: "",
  gender_presentation: "",
  short_concept: "",

  skin_tone: "",
  eye_color: "",
  hair_color: "",
  hair_style: "",
  clothing_style: "",

  kibbe_identity: "",
  body_type: "",
  height: "",
  build: "",
  proportions: [],
  hips_waist_shoulders: "",
  body_notes: "",

  outward_personality: "",
  internal_personality: "",
  mbti_type: "",
  western_zodiac_sign: "",
  east_asian_zodiac_sign: "",
  speech_style: "",
  movement_style: "",
  verbosity_level: "",
  interests: "",
  philosophy: "",
};

export const CHARACTER_TEMPLATE_FIELD_GROUPS = [
  {
    id: "template",
    label: "Template Info",
    description: "Creator-facing name, category, description, and tags.",
  },
  {
    id: "identity",
    label: "Identity Defaults",
    description: "Defaults for the Identity step of new character creation.",
  },
  {
    id: "appearance",
    label: "Appearance Defaults",
    description: "Defaults for visual styling.",
  },
  {
    id: "body",
    label: "Body Defaults",
    description: "Defaults for body silhouette and physical notes.",
  },
  {
    id: "behavior",
    label: "Behavior Defaults",
    description: "Defaults for personality, voice, movement, and interests.",
  },
  {
    id: "review",
    label: "Review",
    description: "Review the template before saving.",
  },
];

export function normalizeCharacterTemplateTags(tags) {
  return String(tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeTemplateProportions(value, legacyValue = "") {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (typeof legacyValue === "string" && legacyValue.trim()) {
    return [legacyValue.trim()];
  }
  return [];
}

export function getCharacterTemplateFields(form) {
  return {
    name: form.name.trim(),
    title: form.character_title.trim(),
    species: form.species.trim(),
    gender_presentation: form.gender_presentation.trim(),
    short_concept: form.short_concept.trim(),

    skin_tone: form.skin_tone.trim(),
    eye_color: form.eye_color.trim(),
    hair_color: form.hair_color.trim(),
    hair_style: form.hair_style.trim(),
    clothing_style: form.clothing_style.trim(),

    kibbe_identity: String(form.kibbe_identity || "").trim(),
    body_type: form.body_type.trim(),
    height: form.height.trim(),
    build: form.build.trim(),
    proportions: normalizeTemplateProportions(
      form.proportions,
      form.hips_waist_shoulders
    ),
    body_notes: form.body_notes.trim(),

    outward_personality: form.outward_personality.trim(),
    internal_personality: form.internal_personality.trim(),
    mbti_type: form.mbti_type.trim(),
    western_zodiac_sign: form.western_zodiac_sign.trim(),
    east_asian_zodiac_sign: form.east_asian_zodiac_sign.trim(),
    speech_style: form.speech_style.trim(),
    movement_style: form.movement_style.trim(),
    verbosity_level: form.verbosity_level.trim(),
    interests: form.interests.trim(),
    philosophy: form.philosophy.trim(),
  };
}

export function removeEmptyTemplateFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    })
  );
}

export function buildCharacterTemplateCreationPayload(form) {
  const templateTitle = form.title.trim() || "Untitled Character Template";
  const templateTags = normalizeCharacterTemplateTags(form.tags);
  const fields = removeEmptyTemplateFields(getCharacterTemplateFields(form));

  return {
    type: "CHARACTER_TEMPLATE",
    title: templateTitle,
    description:
      form.description.trim() ||
      "A reusable character template for new character drafts.",
    visibility: "PRIVATE",
    status: "DRAFT",
    content_rating: "SFW",
    canon_status: "NONE",
    data: {
      template_category: form.category.trim(),
      template_tags: templateTags,
      fields,
      builder: "CHARACTER_TEMPLATE_BUILDER",
      builder_version: "1.0",
    },
  };
}

export function extractCharacterTemplateFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function getCharacterTemplateCompletion(form) {
  const fields = [
    form.title,
    form.category,
    form.description,
    form.tags,
    ...Object.values(getCharacterTemplateFields(form)),
  ];

  const filled = fields.filter((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length;

  return Math.round((filled / fields.length) * 100);
}

export function getCharacterTemplateFilledFieldCount(form) {
  return Object.values(removeEmptyTemplateFields(getCharacterTemplateFields(form)))
    .length;
}

export function getCharacterTemplateSectionStatus(form) {
  return {
    template: Boolean(form.title || form.category || form.description || form.tags),
    identity: Boolean(
      form.name ||
        form.character_title ||
        form.species ||
        form.gender_presentation ||
        form.short_concept
    ),
    appearance: Boolean(
      form.skin_tone ||
        form.eye_color ||
        form.hair_color ||
        form.hair_style ||
        form.clothing_style
    ),
    body: Boolean(
      form.kibbe_identity ||
        form.body_type ||
        form.height ||
        form.build ||
        normalizeTemplateProportions(
          form.proportions,
          form.hips_waist_shoulders
        ).length ||
        form.body_notes
    ),
    behavior: Boolean(
      form.outward_personality ||
        form.internal_personality ||
        form.mbti_type ||
        form.western_zodiac_sign ||
        form.east_asian_zodiac_sign ||
        form.speech_style ||
        form.movement_style ||
        form.verbosity_level ||
        form.interests ||
        form.philosophy
    ),
  };
}