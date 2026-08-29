import { getCommunityCreatorsPageData } from "@/lib/server/studio/getCommunityCreatorsPageData";
import { getStoriesPageData } from "@/lib/server/studio/getStoriesPageData";

export async function getHomePageData() {
  const [stories, creators] = await Promise.all([
    getStoriesPageData(),
    getCommunityCreatorsPageData(),
  ]);

  return {
    rooms: stories.rooms || [],
    ownedCreations: stories.ownedCreations || [],
    communityCreations: stories.communityCreations || [],
    creators: creators.creators || [],
    creatorCreations: creators.creations || stories.communityCreations || [],
    viewerUsername: creators.viewerUsername || null,
    followingUsernames: creators.followingUsernames || [],
    storiesLoadError: stories.loadError || null,
    communityLoadError: stories.savedSourceError || null,
    creatorsLoadError: creators.loadError || null,
  };
}
