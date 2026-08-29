import {
  CHARACTER_CREATOR_TYPES,
  normalizeCharacterCreatorType,
} from "@/components/studio/create/character/characterCreationMode";

export const CHARACTER_CREATOR_STEP_IDS = [
  "identity",
  "appearance",
  "body",
  "behavior",
  "review",
];

export function buildCharacterDescription(form, creationType = "CHARACTER") {
  const normalizedType = normalizeCharacterCreatorType(creationType);
  return (
    form.short_concept ||
    form.title ||
    form.species ||
    (normalizedType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
      ? "A private player character identity created in Crestfall Studio."
      : "A private draft character created in Crestfall Studio.")
  );
}

export function buildCharacterCreationPayload(
  form,
  creationType = CHARACTER_CREATOR_TYPES.CHARACTER
) {
  const normalizedType = normalizeCharacterCreatorType(creationType);
  const isPlayerCharacter =
    normalizedType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER;
  const name =
    form.name?.trim() ||
    (isPlayerCharacter ? "Unnamed Player Character" : "Unnamed Character");

  return {
    type: normalizedType,
    title: name,
    description: buildCharacterDescription(form, normalizedType),
    visibility: form.visibility || "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      name,
      relationship_to_player: isPlayerCharacter
        ? ""
        : form.relationship_to_player || "",
      builder: isPlayerCharacter
        ? "PLAYER_CHARACTER_CREATOR"
        : "CHARACTER_CREATOR",
      builder_version: "2.0",
      ...(isPlayerCharacter
        ? {
            persona_type: "PLAYER_CHARACTER",
            profile_showcase: true,
            ai_controlled: false,
          }
        : {}),
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