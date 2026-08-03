import { notFound } from "next/navigation";

import LocationPromptGuidanceSectionPreviewClient from "./LocationPromptGuidanceSectionPreviewClient";

export default function LocationPromptGuidanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationPromptGuidanceSectionPreviewClient />;
}
