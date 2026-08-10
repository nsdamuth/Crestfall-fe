import { notFound } from "next/navigation";

import KitAssetDetailPopupPreviewClient from "./KitAssetDetailPopupPreviewClient";

export default function KitAssetDetailPopupPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitAssetDetailPopupPreviewClient />;
}
