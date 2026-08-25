import { getCommunityCreationsPageData } from "@/lib/server/studio/getCommunityCreationsPageData";
import CommunityV2Live from "./CommunityV2Live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommunityV2Page() {
  const { creations, loadError } = await getCommunityCreationsPageData();

  return <CommunityV2Live creations={creations} loadError={loadError} />;
}
