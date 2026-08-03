import { notFound } from "next/navigation";

import ScenarioRecommendationsPanelPreviewClient from "./ScenarioRecommendationsPanelPreviewClient";

export default function ScenarioRecommendationsPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioRecommendationsPanelPreviewClient />;
}
