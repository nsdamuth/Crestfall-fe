import { notFound } from "next/navigation";

import OutfitPromptGuidanceSectionPreviewClient from "./OutfitPromptGuidanceSectionPreviewClient";

export default function OutfitPromptGuidanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OutfitPromptGuidanceSectionPreviewClient />;
}
