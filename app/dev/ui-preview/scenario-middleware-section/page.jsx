import { notFound } from "next/navigation";

import ScenarioMiddlewareSectionPreviewClient from "./ScenarioMiddlewareSectionPreviewClient";

export default function ScenarioMiddlewareSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioMiddlewareSectionPreviewClient />;
}
