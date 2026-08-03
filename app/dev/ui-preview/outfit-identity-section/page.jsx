import { notFound } from "next/navigation";

import OutfitIdentitySectionPreviewClient from "./OutfitIdentitySectionPreviewClient";

export default function OutfitIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OutfitIdentitySectionPreviewClient />;
}
