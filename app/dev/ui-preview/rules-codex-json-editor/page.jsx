import { notFound } from "next/navigation";

import RulesCodexJsonEditorPreviewClient from "./RulesCodexJsonEditorPreviewClient";

export default function RulesCodexJsonEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RulesCodexJsonEditorPreviewClient />;
}
