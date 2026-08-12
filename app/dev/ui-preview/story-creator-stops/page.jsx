import { notFound } from "next/navigation";

import StoryCreatorStopsPreviewClient from "./StoryCreatorStopsPreviewClient";

export default function StoryCreatorStopsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryCreatorStopsPreviewClient />;
}
