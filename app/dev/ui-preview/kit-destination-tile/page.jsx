import { notFound } from "next/navigation";

import KitDestinationTilePreviewClient from "./KitDestinationTilePreviewClient";

export default function KitDestinationTilePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitDestinationTilePreviewClient />;
}
