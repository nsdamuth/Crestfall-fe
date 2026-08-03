import { notFound } from "next/navigation";

import StatsPoolsJsonEditorPreviewClient from "./StatsPoolsJsonEditorPreviewClient";

export default function StatsPoolsJsonEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StatsPoolsJsonEditorPreviewClient />;
}
