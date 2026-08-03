import { notFound } from "next/navigation";
import PublicProfileActivityFeedPreviewClient from "./PublicProfileActivityFeedPreviewClient";

export default function PublicProfileActivityFeedPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileActivityFeedPreviewClient />;
}
