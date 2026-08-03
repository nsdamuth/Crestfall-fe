import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createVisualAssetDraft(
  creationPayload,
  fallbackMessage = "Visual asset draft could not be saved."
) {
  return createCreationDraft(creationPayload, fallbackMessage);
}
