import {
  createCreationDraft,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

export async function createNpcRegistryDraft(creationPayload) {
  return createCreationDraft(
    creationPayload,
    "NPC registry could not be saved."
  );
}

export async function fetchMyNpcRegistries() {
  return fetchOwnedCreations({
    type: "NPC_REGISTRY",
  });
}

export async function fetchNpcRegistryCharacterOptions() {
  const [characters, playerCharacters] = await Promise.all([
    fetchOwnedCreations({ type: "CHARACTER" }),
    fetchOwnedCreations({ type: "PLAYER_CHARACTER" }),
  ]);

  return [...characters, ...playerCharacters];
}

export async function fetchLocationRegistryLocationOptions() {
  return fetchOwnedCreations({
    type: "LOCATION",
  });
}