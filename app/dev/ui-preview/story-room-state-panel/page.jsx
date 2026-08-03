import { notFound } from "next/navigation";

import StoryRoomStatePanelPreviewClient from "./StoryRoomStatePanelPreviewClient";

export default function StoryRoomStatePanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomStatePanelPreviewClient />;
}
