import { notFound } from "next/navigation";

import RulesCodexEditorPreviewClient from "./RulesCodexEditorPreviewClient";

export default function RulesCodexEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RulesCodexEditorPreviewClient />;
}
