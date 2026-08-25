import { notFound } from "next/navigation";

import KitImageOverlayPreviewClient from "./KitImageOverlayPreviewClient";

export default function KitImageOverlayPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitImageOverlayPreviewClient />;
}
