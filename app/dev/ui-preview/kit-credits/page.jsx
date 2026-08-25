import { notFound } from "next/navigation";

import KitCreditsPreviewClient from "./KitCreditsPreviewClient";

export default function KitCreditsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitCreditsPreviewClient />;
}
