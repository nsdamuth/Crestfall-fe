import { notFound } from "next/navigation";

import OutfitGarmentDesignSectionPreviewClient from "./OutfitGarmentDesignSectionPreviewClient";

export default function OutfitGarmentDesignSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OutfitGarmentDesignSectionPreviewClient />;
}
