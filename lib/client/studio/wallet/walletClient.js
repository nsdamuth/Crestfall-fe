import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";

export function createWalletProfileDraft(payload) {
  return createCreationDraft(
    payload,
    "Wallet Profile draft could not be saved."
  );
}
