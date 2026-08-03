import { notFound } from "next/navigation";

import CreationProfilePage from "@/components/studio/creations/CreationProfilePage";
import { getPublicCreationProfilePageData } from "@/lib/server/studio/getPublicCreationProfilePageData";
import { getPublicLorePublicationPageData } from "@/lib/server/studio/getPublicLorePublicationPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isLoreCreation(creation) {
  return String(creation?.type || "").trim().toUpperCase() === "LORE";
}

export default async function StudioCreationProfileRoute({ params }) {
  const { id } = await params;

  const cataloguePageData = await getPublicCreationProfilePageData(id);
  let pageData = cataloguePageData;

  if (
    !cataloguePageData.loadError &&
    (!cataloguePageData.creation || isLoreCreation(cataloguePageData.creation))
  ) {
    pageData = await getPublicLorePublicationPageData(id);
  }

  if (!pageData.creation && !pageData.loadError) {
    notFound();
  }

  return (
    <CreationProfilePage
      creation={pageData.creation}
      media={pageData.media}
      loadError={pageData.loadError}
    />
  );
}
