import { notFound } from "next/navigation";

import ProgressionProfileEditorPreviewClient from "./ProgressionProfileEditorPreviewClient";

export default function ProgressionProfileEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ProgressionProfileEditorPreviewClient />;
}
