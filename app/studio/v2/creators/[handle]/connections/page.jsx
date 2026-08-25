import CreatorConnectionsLive from "../../CreatorConnectionsLive";
import { getPublicProfileConnectionsPageData } from "@/lib/server/studio/getPublicProfileConnectionsPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeTab(tab) {
  return tab === "following" ? "following" : "followers";
}

export default async function CreatorConnectionsV2Page({ params, searchParams }) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const initialTab = normalizeTab(resolvedSearchParams?.tab);
  const pageData = await getPublicProfileConnectionsPageData(handle);

  return <CreatorConnectionsLive pageData={pageData} initialTab={initialTab} />;
}
