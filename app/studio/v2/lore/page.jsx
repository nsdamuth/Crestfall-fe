import { getLoreV2PageData } from "@/lib/server/studio/getLoreV2PageData";
import Lore from "./Lore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoreV2Page() {
  const {
    communityCreations,
    communityLoadError,
    ownedCreations,
    ownedLoadError,
  } = await getLoreV2PageData();

  return (
    <Lore
      live
      communityCreations={communityCreations}
      communityLoadError={communityLoadError}
      ownedCreations={ownedCreations}
      ownedLoadError={ownedLoadError}
    />
  );
}
