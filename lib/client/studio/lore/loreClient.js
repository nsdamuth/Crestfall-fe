import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createLoreDraft(payload) {
  return createCreationDraft(payload, "Lore Asset draft could not be saved.");
}
