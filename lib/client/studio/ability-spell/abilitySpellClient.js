import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export function createAbilitySpellProfileDraft(payload) {
  return createCreationDraft(payload, "Ability & Spell Profile draft could not be saved.");
}
