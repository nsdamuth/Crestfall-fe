import {
  createCreationDraft,
} from "@/lib/client/studio/creations/creationClient";

export async function createRulesCodexDraft(payload) {
  return createCreationDraft(
    payload,
    "Rules Codex draft could not be saved."
  );
}
