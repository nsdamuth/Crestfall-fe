import { notFound } from "next/navigation";

import CreatorEngagementActionsPreviewClient from "./CreatorEngagementActionsPreviewClient";

export default function CreatorEngagementActionsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorEngagementActionsPreviewClient />;
}
