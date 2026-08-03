import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createNarratorDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "Narrator draft could not be saved."
  );
}
