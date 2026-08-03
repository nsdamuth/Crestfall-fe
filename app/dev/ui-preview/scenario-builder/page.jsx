import { notFound } from "next/navigation";

import ScenarioBuilderPreviewClient from "./ScenarioBuilderPreviewClient";

export default function ScenarioBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioBuilderPreviewClient />;
}
