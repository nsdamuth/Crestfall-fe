import { notFound } from "next/navigation";

import KnowledgeRulePreviewClient from "./KnowledgeRulePreviewClient";

export default function KnowledgeRulePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KnowledgeRulePreviewClient />;
}
