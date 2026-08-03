import { notFound } from "next/navigation";

import StoryRoomMobileDrawerPreviewClient from "./StoryRoomMobileDrawerPreviewClient";

export default function StoryRoomMobileDrawerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomMobileDrawerPreviewClient />;
}
