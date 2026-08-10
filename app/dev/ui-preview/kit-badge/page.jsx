import { notFound } from "next/navigation";

import KitBadgePreviewClient from "./KitBadgePreviewClient";

export default function KitBadgePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitBadgePreviewClient />;
}
