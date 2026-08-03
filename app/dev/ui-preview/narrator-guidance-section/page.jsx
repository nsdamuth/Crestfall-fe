import { notFound } from "next/navigation";

import NarratorGuidanceSectionPreviewClient from "./NarratorGuidanceSectionPreviewClient";

export default function NarratorGuidanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NarratorGuidanceSectionPreviewClient />;
}
