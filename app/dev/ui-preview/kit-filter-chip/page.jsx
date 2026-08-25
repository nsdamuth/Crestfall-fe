import { notFound } from "next/navigation";

import KitFilterChipPreviewClient from "./KitFilterChipPreviewClient";

export default function KitFilterChipPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitFilterChipPreviewClient />;
}
