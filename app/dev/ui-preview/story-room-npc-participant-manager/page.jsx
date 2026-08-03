import { notFound } from "next/navigation";

import StoryRoomNpcParticipantManagerPreviewClient from "./StoryRoomNpcParticipantManagerPreviewClient";

export default function StoryRoomNpcParticipantManagerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomNpcParticipantManagerPreviewClient />;
}
