import { notFound } from "next/navigation";

import StoryNarrativeRuntimeSectionPreviewClient from "./StoryNarrativeRuntimeSectionPreviewClient";

export default function StoryNarrativeRuntimeSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryNarrativeRuntimeSectionPreviewClient />;
}
