import { notFound } from "next/navigation";

import StorylineFieldsSectionPreviewClient from "./StorylineFieldsSectionPreviewClient";

export default function StorylineFieldsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylineFieldsSectionPreviewClient />;
}
