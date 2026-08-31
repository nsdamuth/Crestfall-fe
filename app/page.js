import PublicHomeView from "@/components/public-home/PublicHome.view";
import { publicHomeFixture } from "@/components/public-home/PublicHome.fixtures";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return <PublicHomeView {...publicHomeFixture} />;
}
