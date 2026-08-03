import {
  createCreationDraft,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

export async function fetchRoomTemplateCreationReferences() {
  try {
    return await fetchOwnedCreations();
  } catch (error) {
    throw new Error(
      error.message || "Room template references could not be loaded."
    );
  }
}

export async function fetchMutualPlayers() {
  const response = await fetch("/api/profile/mutuals", {
    method: "GET",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || "Mutual followers could not be loaded."
    );
  }

  return payload?.data?.mutuals || [];
}

export async function createRoomTemplateDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "Room template draft could not be saved."
  );
}