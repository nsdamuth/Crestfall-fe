import { getCommunityCreationsPageData } from "@/lib/server/studio/getCommunityCreationsPageData";
import AdventuresLive from "./AdventuresLive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdventuresV2Page() {
  const { creations, loadError } = await getCommunityCreationsPageData();

  return <AdventuresLive creations={creations} loadError={loadError} />;
}
