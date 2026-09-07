import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createMechanicsActionDraft(payload) {
  return createCreationDraft(
    payload,
    "Mechanics Action draft could not be saved."
  );
}
