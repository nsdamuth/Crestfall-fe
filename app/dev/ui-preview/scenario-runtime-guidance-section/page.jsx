import { notFound } from "next/navigation";

import ScenarioRuntimeGuidanceSectionPreviewClient from "./ScenarioRuntimeGuidanceSectionPreviewClient";

export default function ScenarioRuntimeGuidanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioRuntimeGuidanceSectionPreviewClient />;
}
