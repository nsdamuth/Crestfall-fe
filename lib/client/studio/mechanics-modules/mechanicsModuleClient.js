import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createMechanicsModuleDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "Mechanics module draft could not be saved."
  );
}
