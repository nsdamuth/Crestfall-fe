import {
  createCreationDraft,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

export async function createCharacterTemplateDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "Character template could not be saved."
  );
}

export async function fetchMyCharacterTemplates() {
  return fetchOwnedCreations({
    type: "CHARACTER_TEMPLATE",
  });
}