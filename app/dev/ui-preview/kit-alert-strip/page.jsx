import { notFound } from "next/navigation";

import KitAlertStripPreviewClient from "./KitAlertStripPreviewClient";

export default function KitAlertStripPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitAlertStripPreviewClient />;
}
