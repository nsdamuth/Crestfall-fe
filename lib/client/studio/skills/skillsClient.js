import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export function createSkillsProfileDraft(payload) {
  return createCreationDraft(
    payload,
    "Skills Profile draft could not be saved."
  );
}
