import {
  createCreationDraft,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

export async function fetchStorylineReferences() {
  const [stories, scenarios] = await Promise.all([
    fetchOwnedCreations({ type: "ROOM_TEMPLATE" }),
    fetchOwnedCreations({ type: "SCENARIO" }),
  ]);

  return {
    stories,
    scenarios,
  };
}

export async function fetchOwnedStorylines() {
  return fetchOwnedCreations({ type: "STORYLINE" });
}

export async function createStorylineDraft(payload) {
  return createCreationDraft(
    payload,
    "Storyline draft could not be saved."
  );
}
