import { notFound } from "next/navigation";

import ProgressionJsonEditorPreviewClient from "./ProgressionJsonEditorPreviewClient";

export default function ProgressionJsonEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ProgressionJsonEditorPreviewClient />;
}
