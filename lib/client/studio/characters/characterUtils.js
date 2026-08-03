export const CHARACTER_CREATOR_STEP_IDS = [
  "identity",
  "appearance",
  "body",
  "behavior",
  "review",
];

export function buildCharacterDescription(form) {
  return (
    form.short_concept ||
    form.title ||
    form.species ||
    "A private draft character created in Crestfall Studio."
  );
}

export function buildCharacterCreationPayload(form) {
  const name = form.name?.trim() || "Unnamed Character";

  return {
    type: "CHARACTER",
    title: name,
    description: buildCharacterDescription(form),
    visibility: form.visibility || "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      name,
      builder: "CHARACTER_CREATOR",
      builder_version: "1.0",
    },
  };
}

export function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function getCharacterTemplateFields(template) {
  return template?.data?.fields || template?.fields || {};
}

export function applyCharacterTemplateToForm(currentForm, template) {
  return {
    ...currentForm,
    ...getCharacterTemplateFields(template),
  };
}