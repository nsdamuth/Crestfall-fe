import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createProgressionProfileDraft(payload) {
  return createCreationDraft(
    payload,
    "Progression Profile draft could not be saved."
  );
}
