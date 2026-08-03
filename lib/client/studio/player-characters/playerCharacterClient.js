import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createPlayerCharacterDraft(
  creationPayload,
  fallbackMessage = "Player character draft could not be saved."
) {
  return createCreationDraft(creationPayload, fallbackMessage);
}
