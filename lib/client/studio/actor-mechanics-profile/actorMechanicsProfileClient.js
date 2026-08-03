import {
  createCreationDraft,
} from "@/lib/client/studio/creations/creationClient";

export async function createActorMechanicsProfileDraft(payload) {
  return createCreationDraft(
    payload,
    "Actor Mechanics Profile draft could not be saved."
  );
}
