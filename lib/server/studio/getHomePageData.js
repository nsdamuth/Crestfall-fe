import { getCommunityCreatorsPageData } from "@/lib/server/studio/getCommunityCreatorsPageData";
import { getLoreV2PageData } from "@/lib/server/studio/getLoreV2PageData";
import { getStoriesPageData } from "@/lib/server/studio/getStoriesPageData";

export async function getHomePageData() {
  const [stories, creators, lore] = await Promise.all([
    getStoriesPageData(),
    getCommunityCreatorsPageData(),
    getLoreV2PageData(),
  ]);

  return {
    rooms: stories.rooms || [],
    ownedCreations: stories.ownedCreations || [],
    communityCreations: stories.communityCreations || [],
    creators: creators.creators || [],
    creatorCreations: creators.creations || stories.communityCreations || [],
    loreCommunityCreations: lore.communityCreations || [],
    loreOwnedCreations: lore.ownedCreations || [],
    viewerUsername: creators.viewerUsername || null,
    viewerDisplayName: creators.viewerDisplayName || null,
    followingUsernames: creators.followingUsernames || [],
    storiesLoadError: stories.loadError || null,
    communityLoadError: stories.savedSourceError || null,
    creatorsLoadError: creators.loadError || null,
    loreLoadError: lore.communityLoadError || lore.ownedLoadError || null,
  };
}
