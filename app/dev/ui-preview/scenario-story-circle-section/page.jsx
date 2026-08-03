import { notFound } from "next/navigation";

import ScenarioStoryCircleSectionPreviewClient from "./ScenarioStoryCircleSectionPreviewClient";

export default function ScenarioStoryCircleSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioStoryCircleSectionPreviewClient />;
}
