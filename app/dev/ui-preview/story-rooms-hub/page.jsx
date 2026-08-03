import { notFound } from "next/navigation";

import StoryRoomsHubPreviewClient from "./StoryRoomsHubPreviewClient";

export default function StoryRoomsHubPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomsHubPreviewClient />;
}
