import { getCommunityCreationsPageData } from "@/lib/server/studio/getCommunityCreationsPageData";
import { getMyCreationsPageData } from "@/lib/server/studio/getMyCreationsPageData";
import VaultV2Live from "./VaultV2Live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VaultV2Page() {
  const [ownedResult, communityResult] = await Promise.all([
    getMyCreationsPageData(),
    getCommunityCreationsPageData(),
  ]);

  return (
    <VaultV2Live
      creations={ownedResult.creations}
      communityCreations={communityResult.creations}
      loadError={ownedResult.loadError}
      savedSourceError={communityResult.loadError}
    />
  );
}
