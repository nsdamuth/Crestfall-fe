import { notFound } from "next/navigation";

import KitCreatorCardPreviewClient from "./KitCreatorCardPreviewClient";

export default function KitCreatorCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitCreatorCardPreviewClient />;
}
