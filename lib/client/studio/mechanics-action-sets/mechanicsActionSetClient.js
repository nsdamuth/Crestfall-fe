import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createMechanicsActionSetDraft(payload) {
  return createCreationDraft(
    payload,
    "Mechanics Action Set draft could not be saved."
  );
}
