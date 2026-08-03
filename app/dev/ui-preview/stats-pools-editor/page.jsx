import { notFound } from "next/navigation";

import StatsPoolsEditorPreviewClient from "./StatsPoolsEditorPreviewClient";

export default function StatsPoolsEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StatsPoolsEditorPreviewClient />;
}
