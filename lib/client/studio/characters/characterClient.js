import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createCharacterDraft(
  creationPayload,
  fallbackMessage = "Character draft could not be saved."
) {
  return createCreationDraft(creationPayload, fallbackMessage);
}