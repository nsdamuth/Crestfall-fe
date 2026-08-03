import { notFound } from "next/navigation";

import OutfitMaterialsDetailsSectionPreviewClient from "./OutfitMaterialsDetailsSectionPreviewClient";

export default function OutfitMaterialsDetailsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OutfitMaterialsDetailsSectionPreviewClient />;
}
