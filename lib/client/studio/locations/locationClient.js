import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createLocationDraft(
  creationPayload,
  fallbackMessage = "Location draft could not be saved."
) {
  return createCreationDraft(creationPayload, fallbackMessage);
}
