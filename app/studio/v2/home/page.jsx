import Home from "./Home";
import { getHomePageData } from "@/lib/server/studio/getHomePageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomeV2Page() {
  const data = await getHomePageData();
  return <Home {...data} />;
}
