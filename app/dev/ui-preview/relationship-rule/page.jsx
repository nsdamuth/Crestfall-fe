import { notFound } from "next/navigation";

import RelationshipRulePreviewClient from "./RelationshipRulePreviewClient";

export default function RelationshipRulePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RelationshipRulePreviewClient />;
}
