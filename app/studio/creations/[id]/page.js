import { notFound } from "next/navigation";

import CreationProfilePage from "@/components/studio/creations/CreationProfilePage";
import { getPublicCreationProfilePageData } from "@/lib/server/studio/getPublicCreationProfilePageData";
import { getPublicLorePublicationPageData } from "@/lib/server/studio/getPublicLorePublicationPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isLoreCreation(creation) {
  return String(creation?.type || "").trim().toUpperCase() === "LORE";
}

function isPublishedCreation(creation) {
  const visibility = String(creation?.visibility || "").trim().toUpperCase();
  const canonStatus = String(creation?.canonStatus || creation?.canon_status || "")
    .trim()
    .toUpperCase();
  const status = String(creation?.status || "").trim().toUpperCase();

  return status === "APPROVED" && (visibility === "PUBLIC" || canonStatus === "CANON");
}

export default async function StudioCreationProfileRoute({ params }) {
  const { id } = await params;

  const cataloguePageData = await getPublicCreationProfilePageData(id);
  let pageData = cataloguePageData;

  if (
    !cataloguePageData.loadError &&
    (!cataloguePageData.creation ||
      (isLoreCreation(cataloguePageData.creation) &&
        isPublishedCreation(cataloguePageData.creation)))
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
      libraryPass={pageData.libraryPass}
      loadError={pageData.loadError}
    />
  );
}
