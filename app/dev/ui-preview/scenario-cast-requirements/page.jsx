import { notFound } from "next/navigation";

import ScenarioCastRequirementsPreviewClient from "./ScenarioCastRequirementsPreviewClient";

export default function ScenarioCastRequirementsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioCastRequirementsPreviewClient />;
}
