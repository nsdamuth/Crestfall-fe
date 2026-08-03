import { notFound } from "next/navigation";

import StoryRoomCastPanelPreviewClient from "./StoryRoomCastPanelPreviewClient";

export default function StoryRoomCastPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomCastPanelPreviewClient />;
}
