import { notFound } from "next/navigation";

import ScenarioIdentitySectionPreviewClient from "./ScenarioIdentitySectionPreviewClient";

export default function ScenarioIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioIdentitySectionPreviewClient />;
}
