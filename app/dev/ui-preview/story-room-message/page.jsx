import { notFound } from "next/navigation";

import StoryRoomMessagePreviewClient from "./StoryRoomMessagePreviewClient";

export default function StoryRoomMessagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomMessagePreviewClient />;
}
