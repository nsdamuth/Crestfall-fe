import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createCharacterDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "Character draft could not be saved."
  );
}