import { notFound } from "next/navigation";

import StoryRoomChatShellPreviewClient from "./StoryRoomChatShellPreviewClient";

export default function StoryRoomChatShellPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomChatShellPreviewClient />;
}
