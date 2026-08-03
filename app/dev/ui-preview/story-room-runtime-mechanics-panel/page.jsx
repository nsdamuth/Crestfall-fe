import { notFound } from "next/navigation";

import StoryRoomRuntimeMechanicsPanelPreviewClient from "./StoryRoomRuntimeMechanicsPanelPreviewClient";

export default function StoryRoomRuntimeMechanicsPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomRuntimeMechanicsPanelPreviewClient />;
}
