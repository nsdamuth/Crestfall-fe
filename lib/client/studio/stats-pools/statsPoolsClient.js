import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export async function createStatsPoolsProfileDraft(payload) {
  return createCreationDraft(
    payload,
    "Stats & Pools Profile draft could not be saved."
  );
}
