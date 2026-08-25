import { feApiRequest } from "@/lib/server/api/feApiRequest";
import { getCommunityCreationsPageData } from "@/lib/server/studio/getCommunityCreationsPageData";
import { getMyCreationsPageData } from "@/lib/server/studio/getMyCreationsPageData";

async function getStoryRoomsPageData() {
  try {
    const payload = await feApiRequest({
      path: "/api/studio/story-rooms",
    });

    return {
      rooms: payload?.data?.rooms || [],
      loadError: null,
    };
  } catch (error) {
    return {
      rooms: [],
      loadError:
        error?.payload?.error?.message ||
        error?.message ||
        "Stories could not be loaded.",
    };
  }
}

export async function getStoriesPageData() {
  const [roomsResult, ownedResult, communityResult] = await Promise.all([
    getStoryRoomsPageData(),
    getMyCreationsPageData(),
    getCommunityCreationsPageData(),
  ]);

  return {
    rooms: roomsResult.rooms,
    ownedCreations: ownedResult.creations,
    communityCreations: communityResult.creations,
    loadError: roomsResult.loadError || ownedResult.loadError || null,
    savedSourceError: communityResult.loadError || null,
  };
}
