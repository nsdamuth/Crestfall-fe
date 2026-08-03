import { notFound } from "next/navigation";

import PublicProfileEngagementActionsPreviewClient from "./PublicProfileEngagementActionsPreviewClient";

export default function PublicProfileEngagementActionsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileEngagementActionsPreviewClient />;
}
