import { notFound } from "next/navigation";

import PosePromptGuidanceSectionPreviewClient from "./PosePromptGuidanceSectionPreviewClient";

export default function PosePromptGuidanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PosePromptGuidanceSectionPreviewClient />;
}
