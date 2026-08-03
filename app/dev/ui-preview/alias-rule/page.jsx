import { notFound } from "next/navigation";

import AliasRulePreviewClient from "./AliasRulePreviewClient";

export default function AliasRulePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AliasRulePreviewClient />;
}
