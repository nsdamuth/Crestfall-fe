import { notFound } from "next/navigation";

import StoryRulesCodexAttachmentsSectionPreviewClient from "./StoryRulesCodexAttachmentsSectionPreviewClient";

export default function StoryRulesCodexAttachmentsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRulesCodexAttachmentsSectionPreviewClient />;
}
