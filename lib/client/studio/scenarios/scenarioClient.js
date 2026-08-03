import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createScenarioDraft(
  creationPayload,
  fallbackMessage = "Scenario draft could not be saved."
) {
  return createCreationDraft(creationPayload, fallbackMessage);
}
