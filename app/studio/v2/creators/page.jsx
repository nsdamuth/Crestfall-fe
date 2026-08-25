import CreatorsV2Live from "./CreatorsV2Live";
import { getCommunityCreatorsPageData } from "@/lib/server/studio/getCommunityCreatorsPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreatorsV2Page() {
  const {
    creators,
    creations,
    viewerUsername,
    followingUsernames,
    loadError,
  } = await getCommunityCreatorsPageData();

  return (
    <CreatorsV2Live
      creators={creators}
      creations={creations}
      viewerUsername={viewerUsername}
      followingUsernames={followingUsernames}
      loadError={loadError}
    />
  );
}
