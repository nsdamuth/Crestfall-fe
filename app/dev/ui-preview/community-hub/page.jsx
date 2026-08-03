import { notFound } from "next/navigation";

import CommunityHubPreviewClient from "./CommunityHubPreviewClient";

export default function CommunityHubPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CommunityHubPreviewClient />;
}
