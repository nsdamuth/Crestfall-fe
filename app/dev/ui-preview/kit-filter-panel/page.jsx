import { notFound } from "next/navigation";

import KitFilterPanelPreviewClient from "./KitFilterPanelPreviewClient";

export default function KitFilterPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitFilterPanelPreviewClient />;
}
