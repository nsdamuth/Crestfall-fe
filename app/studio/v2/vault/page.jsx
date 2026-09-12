import { getMyCreationsPageData } from "@/lib/server/studio/getMyCreationsPageData";
import VaultV2Live from "./VaultV2Live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VaultV2Page() {
  const ownedResult = await getMyCreationsPageData();

  return (
    <VaultV2Live
      creations={ownedResult.creations}
      loadError={ownedResult.loadError}
    />
  );
}
