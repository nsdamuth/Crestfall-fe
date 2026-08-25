import { notFound } from "next/navigation";

import KitArtPlaceholderPreviewClient from "./KitArtPlaceholderPreviewClient";

export default function KitArtPlaceholderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitArtPlaceholderPreviewClient />;
}
