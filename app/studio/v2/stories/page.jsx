import { getStoriesPageData } from "@/lib/server/studio/getStoriesPageData";
import StoriesV2Live from "./StoriesV2Live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoriesV2Page() {
  const data = await getStoriesPageData();

  return <StoriesV2Live {...data} />;
}
