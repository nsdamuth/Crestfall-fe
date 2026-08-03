import { notFound } from "next/navigation";

import StoryRoomTranscriptPreviewClient from "./StoryRoomTranscriptPreviewClient";

export default function StoryRoomTranscriptPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomTranscriptPreviewClient />;
}
