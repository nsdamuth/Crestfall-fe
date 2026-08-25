import { notFound } from "next/navigation";

import KitRailPreviewClient from "./KitRailPreviewClient";

export default function KitRailPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitRailPreviewClient />;
}
