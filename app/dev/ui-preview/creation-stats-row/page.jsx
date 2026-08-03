import { notFound } from "next/navigation";

import CreationStatsRowPreviewClient from "./CreationStatsRowPreviewClient";

export default function CreationStatsRowPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationStatsRowPreviewClient />;
}
