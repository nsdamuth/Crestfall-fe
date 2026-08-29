import { feApiRequest } from "@/lib/server/api/feApiRequest";
import { listPublicLorePublications } from "@/lib/server/services/creations/lorePublicationService";

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.error?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

async function loadCommunityLore() {
  try {
    const payload = await listPublicLorePublications({
      limit: 100,
      offset: 0,
    });

    return {
      creations: payload?.data?.creations || [],
      loadError: null,
    };
  } catch (error) {
    return {
      creations: [],
      loadError: getErrorMessage(
        error,
        "Published Lore could not be loaded."
      ),
    };
  }
}

async function loadOwnedLore() {
  try {
    const payload = await feApiRequest({
      path: "/api/creations?view=summary&type=LORE",
    });

    return {
      creations: payload?.data?.creations || [],
      loadError: null,
    };
  } catch (error) {
    return {
      creations: [],
      loadError: getErrorMessage(
        error,
        "Your Lore could not be loaded."
      ),
    };
  }
}

async function loadOwnedTimelines() {
  try {
    const payload = await feApiRequest({
      path: "/api/creations?view=summary&type=TIMELINE",
    });

    return {
      creations: payload?.data?.creations || [],
      loadError: null,
    };
  } catch (error) {
    return {
      creations: [],
      loadError: getErrorMessage(
        error,
        "Your Timelines could not be loaded."
      ),
    };
  }
}

export async function getLoreV2PageData() {
  const [community, owned, timelines] = await Promise.all([
    loadCommunityLore(),
    loadOwnedLore(),
    loadOwnedTimelines(),
  ]);

  return {
    communityCreations: community.creations,
    communityLoadError: community.loadError,
    ownedCreations: owned.creations,
    ownedLoadError: owned.loadError,
    ownedTimelines: timelines.creations,
    ownedTimelinesLoadError: timelines.loadError,
  };
}
