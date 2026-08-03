import { notFound } from "next/navigation";

import CreationOverviewSectionPreviewClient from "./CreationOverviewSectionPreviewClient";

export default function CreationOverviewSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationOverviewSectionPreviewClient />;
}
