import { notFound } from "next/navigation";

import KitCreationCardPreviewClient from "./KitCreationCardPreviewClient";

export default function KitCreationCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitCreationCardPreviewClient />;
}
